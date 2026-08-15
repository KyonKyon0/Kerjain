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
        const statsRows: any[] = await prisma.$queryRawUnsafe(
          `SELECT 
            COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_jobs,
            COUNT(*) FILTER (WHERE status IN ('PUBLISHED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS')) as active_jobs,
            COUNT(*) as total_jobs,
            COALESCE(SUM(reward_amount) FILTER (WHERE status = 'COMPLETED'), 0) as total_spending
          FROM jobs
          WHERE consumer_id = $1::uuid;`,
          user.id
        );

        if (statsRows && statsRows.length > 0) {
          const row = statsRows[0];
          computedStats = {
            completed_jobs: Number(row.completed_jobs || 0),
            active_jobs: Number(row.active_jobs || 0),
            total_jobs: Number(row.total_jobs || 0),
            total_spending: Number(row.total_spending || 0),
          };
        }
      } catch {
        // Fallback with standard Prisma
        const [completedJobsCount, activeJobsCount, totalJobsCount] = await Promise.all([
          prisma.job.count({ where: { consumer_id: user.id, status: 'COMPLETED' } }),
          prisma.job.count({
            where: {
              consumer_id: user.id,
              status: { in: ['PUBLISHED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS'] }
            }
          }),
          prisma.job.count({ where: { consumer_id: user.id } })
        ]);

        computedStats = {
          completed_jobs: completedJobsCount,
          active_jobs: activeJobsCount,
          total_jobs: totalJobsCount,
          total_spending: 0,
        };
      }
    } else {
      try {
        const results = await Promise.all([
          prisma.$queryRawUnsafe(
            `SELECT 
              COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_jobs,
              COUNT(*) FILTER (WHERE status IN ('ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORKING', 'WAITING_CONFIRMATION', 'IN_PROGRESS')) as active_jobs,
              COUNT(*) as total_jobs,
              COALESCE(SUM(reward_amount) FILTER (WHERE status = 'COMPLETED'), 0) as total_earnings
            FROM jobs
            WHERE partner_id = $1::uuid;`,
            user.id
          ),
          prisma.$queryRawUnsafe(
            `SELECT COALESCE(AVG(rating), 5.0) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE reviewee_id = $1::uuid;`,
            user.id
          )
        ]);

        const jobStatsRows: any = results[0];
        const reviewStatsRows: any = results[1];

        const jobRow = Array.isArray(jobStatsRows) && jobStatsRows[0] ? jobStatsRows[0] : {};
        const reviewRow = Array.isArray(reviewStatsRows) && reviewStatsRows[0] ? reviewStatsRows[0] : {};


        const completedJobs = Number(jobRow.completed_jobs || 0);
        const totalJobs = Number(jobRow.total_jobs || 0);
        const totalReviews = Number(reviewRow.total_reviews || 0);
        const avgRating = totalReviews > 0 ? Number(Number(reviewRow.avg_rating || 5.0).toFixed(1)) : (completedJobs > 0 ? 5.0 : 0);
        const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 100;

        computedStats = {
          completed_jobs: completedJobs,
          active_jobs: Number(jobRow.active_jobs || 0),
          total_jobs: totalJobs,
          rating: avgRating,
          total_reviews: totalReviews,
          total_earnings: Number(jobRow.total_earnings || 0),
          completion_rate: completionRate
        };
      } catch {
        computedStats = {
          completed_jobs: 0,
          active_jobs: 0,
          total_jobs: 0,
          rating: 5.0,
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

    // Execute update
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

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
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
