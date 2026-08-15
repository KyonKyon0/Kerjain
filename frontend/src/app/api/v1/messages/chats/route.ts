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

    // Calculate unread messages and format chat items
    const chatItems = await Promise.all(
      activeChatJobs.map(async (job) => {
        const isConsumer = user.id === job.consumer_id
        const partnerInfo = isConsumer ? job.partner : job.consumer
        const partnerName = partnerInfo?.name || (isConsumer ? 'Menunggu Mitra...' : 'Konsumen')
        const partnerPhone = partnerInfo?.phone || null

        // Count unread messages sent by the other party
        const unreadCount = await prisma.message.count({
          where: {
            jobId: job.id,
            senderId: { not: user.id },
            read: false
          }
        })

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
    )

    // Sort chats by latest message time
    chatItems.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

    return NextResponse.json({ success: true, data: chatItems })
  } catch (error: any) {
    console.error('GET /api/v1/messages/chats error:', error)
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 })
  }
}

