import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;`);
      await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);`);
    } catch {}

    // Fetch user details safely with raw query fallback if Prisma Client DMMF is caching old fields
    let fullUser: any = null;
    try {
      const rawUsers: any[] = await prisma.$queryRawUnsafe(
        `SELECT id, name, email, phone, address, avatar_url, gender, role, created_at, updated_at FROM users WHERE id = $1::uuid LIMIT 1;`,
        user.id
      );
      if (rawUsers && rawUsers.length > 0) {
        fullUser = rawUsers[0];
      }
    } catch {
      fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          role: true,
          created_at: true,
          updated_at: true
        }
      });
    }

    if (!fullUser) return NextResponse.json({ detail: 'Pengguna tidak ditemukan' }, { status: 404 });

    // Calculate ACTUAL real stats from Supabase database scoped strictly by user role and user id
    let computedStats: any = {};

    if (user.role === 'consumer') {
      const [completedJobsCount, activeJobsCount, totalJobsCount, paymentsAgg] = await Promise.all([
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
        })
      ]);

      // Also compute total spend from completed jobs reward amount if payments table isn't yet populated
      const completedJobs = await prisma.job.findMany({
        where: { consumer_id: user.id, status: 'COMPLETED' },
        select: { reward_amount: true }
      });
      const jobsSpend = completedJobs.reduce((sum, j) => sum + Number(j.reward_amount || 0), 0);
      const totalSpending = Number(paymentsAgg._sum.amount || 0) > 0 ? Number(paymentsAgg._sum.amount) : jobsSpend;

      computedStats = {
        completed_jobs: completedJobsCount,
        active_jobs: activeJobsCount,
        total_jobs: totalJobsCount,
        total_spending: totalSpending,
      };
    } else {
      const [completedJobsCount, activeJobsCount, totalJobsCount, reviewStats, earningsAgg] = await Promise.all([
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
        prisma.review.aggregate({
          where: { reviewee_id: user.id },
          _avg: { rating: true },
          _count: { rating: true }
        }),
        prisma.payment.aggregate({
          where: { partner_id: user.id, status: 'SUCCESS' },
          _sum: { amount: true }
        })
      ]);

      const averageRating = reviewStats._avg.rating 
        ? Number(reviewStats._avg.rating.toFixed(1)) 
        : (completedJobsCount > 0 ? 5.0 : 0);
      const totalReviews = reviewStats._count.rating || 0;
      const totalEarnings = Number(earningsAgg._sum.amount || 0);
      const completionRate = totalJobsCount > 0 
        ? Math.round((completedJobsCount / totalJobsCount) * 100) 
        : 100;

      computedStats = {
        completed_jobs: completedJobsCount,
        active_jobs: activeJobsCount,
        total_jobs: totalJobsCount,
        rating: averageRating,
        total_reviews: totalReviews,
        total_earnings: totalEarnings,
        completion_rate: completionRate
      };
    }

    return NextResponse.json({
      success: true,
      message: 'Profil pengguna',
      data: {
        ...fullUser,
        gender: fullUser.gender || null,
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

    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;`);
      await prisma.$executeRawUnsafe(`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);`);
    } catch {}

    // Execute update with raw query fallback
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE users SET 
          name = COALESCE($1, name), 
          phone = $2, 
          address = $3, 
          avatar_url = $4, 
          gender = COALESCE($5, gender),
          updated_at = NOW() 
        WHERE id = $6::uuid;`,
        name ? name.trim() : null,
        phone !== undefined ? (phone ? phone.trim() : null) : null,
        address !== undefined ? (address ? address.trim() : null) : null,
        avatar_url !== undefined ? avatar_url : null,
        gender ? gender.trim() : null,
        user.id
      );
    } catch {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name ? name.trim() : undefined,
          phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
          address: address !== undefined ? (address ? address.trim() : null) : undefined,
        }
      });
    }

    const updatedUserRows: any[] = await prisma.$queryRawUnsafe(
      `SELECT id, name, email, phone, address, avatar_url, gender, role, created_at, updated_at FROM users WHERE id = $1::uuid LIMIT 1;`,
      user.id
    );

    const updatedUser = updatedUserRows && updatedUserRows.length > 0 ? updatedUserRows[0] : user;

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updatedUser
    });
  } catch (error: any) {
    console.error('PUT /api/v1/users/profile error:', error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
