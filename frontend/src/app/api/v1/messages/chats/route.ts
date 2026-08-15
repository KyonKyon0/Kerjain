import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    // Find all jobs where the user is either the consumer or the partner
    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { consumer_id: user.id },
          { partner_id: user.id }
        ]
      },
      include: {
        consumer: { select: { id: true, name: true, phone: true } },
        partner: { select: { id: true, name: true, phone: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updated_at: 'desc' }
    })

    // Filter jobs: include jobs that either have messages OR have an assigned partner
    const activeChatJobs = jobs.filter(j => j.messages.length > 0 || j.partner_id !== null)
    const activeJobIds = activeChatJobs.map(j => j.id)

    // Batch count unread messages in a single query to eliminate N+1 DB connections
    let unreadMap = new Map<string, number>()
    if (activeJobIds.length > 0) {
      const unreadGroups = await prisma.message.groupBy({
        by: ['jobId'],
        where: {
          jobId: { in: activeJobIds },
          senderId: { not: user.id },
          read: false
        },
        _count: {
          _all: true
        }
      })
      unreadMap = new Map(unreadGroups.map(g => [g.jobId, g._count._all]))
    }

    // Format chat items synchronously
    const chatItems = activeChatJobs.map((job) => {
      const isConsumer = user.id === job.consumer_id
      const partnerInfo = isConsumer ? job.partner : job.consumer
      const partnerName = partnerInfo?.name || (isConsumer ? 'Menunggu Mitra...' : 'Konsumen')
      const partnerPhone = partnerInfo?.phone || null
      const unreadCount = unreadMap.get(job.id) || 0

      const lastMessage = job.messages[0]
      const lastMessageText = lastMessage?.content || (job.partner_id ? 'Pekerjaan telah disepakati. Mulai koordinasi!' : 'Menunggu mitra mengambil pekerjaan...')
      const lastMessageTime = lastMessage?.createdAt ? lastMessage.createdAt.toISOString() : job.updated_at.toISOString()

      return {
        jobId: job.id,
        jobTitle: job.title,
        jobStatus: job.status,
        partnerName,
        partnerPhone,
        partnerId: partnerInfo?.id || null,
        lastMessage: lastMessageText,
        lastMessageTime,
        unreadCount
      }
    })

    // Sort chats by latest message time
    chatItems.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

    return NextResponse.json({ success: true, data: chatItems })
  } catch (error: any) {
    console.error('GET /api/v1/messages/chats error:', error)
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 })
  }
}

