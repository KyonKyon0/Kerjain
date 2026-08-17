import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    let computedStats: any = {};

    if (user.role === 'consumer') {
      try {
        const [completedCount, activeCount, totalCount, paidPaymentsAggregate, activePaidJobsAggregate] = await Promise.all([
          prisma.job.count({
            where: { consumer_id: user.id, status: 'COMPLETED' }
          }),
          prisma.job.count({
            where: {
              consumer_id: user.id,
              status: { in: ['PUBLISHED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS'] }
            }
          }),
          prisma.job.count({
            where: { consumer_id: user.id }
          }),
          prisma.payment.aggregate({
            where: { consumer_id: user.id, status: 'SUCCESS' },
            _sum: { amount: true }
          }),
          prisma.job.aggregate({
            where: { 
              consumer_id: user.id, 
              status: { in: ['PUBLISHED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS', 'COMPLETED'] } 
            },
            _sum: { reward_amount: true }
          })
        ]);

        const paymentTotal = Number(paidPaymentsAggregate._sum?.amount || 0);
        const jobsTotal = Number(activePaidJobsAggregate._sum?.reward_amount || 0);
        const totalSpending = Math.max(paymentTotal, jobsTotal);

        computedStats = {
          completed_jobs: completedCount,
          active_jobs: activeCount,
          total_jobs: totalCount,
          total_spending: totalSpending,
        };
      } catch (err: any) {
        console.error('Error computing consumer stats:', err);
        computedStats = {
          completed_jobs: 0,
          active_jobs: 0,
          total_jobs: 0,
          total_spending: 0,
        };
      }
    } else {
      try {
        const [completedCount, activeCount, totalCount, earningsAggregate, reviewAggregate] = await Promise.all([
          prisma.job.count({
            where: { partner_id: user.id, status: 'COMPLETED' }
          }),
          prisma.job.count({
            where: {
              partner_id: user.id,
              status: { in: ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS'] }
            }
          }),
          prisma.job.count({
            where: { partner_id: user.id }
          }),
          prisma.job.aggregate({
            where: { partner_id: user.id, status: 'COMPLETED' },
            _sum: { reward_amount: true }
          }),
          prisma.review.aggregate({
            where: { reviewee_id: user.id },
            _avg: { rating: true },
            _count: { rating: true }
          })
        ]);

        const totalReviews = reviewAggregate._count?.rating || 0;
        const avgRating = totalReviews > 0 ? Number(Number(reviewAggregate._avg?.rating || 0).toFixed(2)) : 0;
        const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

        computedStats = {
          completed_jobs: completedCount,
          active_jobs: activeCount,
          total_jobs: totalCount,
          rating: avgRating,
          total_reviews: totalReviews,
          total_earnings: Number(earningsAggregate._sum?.reward_amount || 0),
          completion_rate: completionRate
        };
      } catch (err: any) {
        console.error('Error computing partner stats:', err);
        computedStats = {
          completed_jobs: 0,
          active_jobs: 0,
          total_jobs: 0,
          rating: 0,
          total_reviews: 0,
          total_earnings: 0,
          completion_rate: 100
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profil pengguna',
      data: {
        ...user,
        gender: user.gender || null,
        stats: computedStats
      }
    });
  } catch (error: any) {
    console.error('GET /api/v1/users/profile error:', error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, phone, address, avatar_url, gender } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name ? name.trim() : undefined,
        phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
        address: address !== undefined ? (address ? address.trim() : null) : undefined,
        avatar_url: avatar_url !== undefined ? avatar_url : undefined,
        gender: gender ? gender.trim() : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        avatar_url: true,
        gender: true,
        role: true,
        created_at: true,
        updated_at: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updatedUser || user
    });
  } catch (error: any) {
    console.error('PUT /api/v1/users/profile error:', error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
