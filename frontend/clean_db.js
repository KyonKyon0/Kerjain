import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");

  // Delete all jobs that contain "test" or "sdf" or "ghf" (like the ones from testing)
  const jobs = await prisma.job.findMany({
    where: {
      OR: [
        { title: { contains: 'test', mode: 'insensitive' } },
        { title: { contains: 'sdf', mode: 'insensitive' } },
        { title: { contains: 'ghf', mode: 'insensitive' } },
        { description: { contains: 'test', mode: 'insensitive' } },
        { description: { contains: 'sdf', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Found ${jobs.length} test jobs to delete.`);

  for (const job of jobs) {
    console.log(`Deleting job: ${job.title}`);
    
    // Delete related records first
    await prisma.jobProgress.deleteMany({ where: { job_id: job.id } });
    await prisma.payment.deleteMany({ where: { job_id: job.id } });
    await prisma.review.deleteMany({ where: { job_id: job.id } });
    await prisma.message.deleteMany({ where: { job_id: job.id } });
    
    // Delete the job
    await prisma.job.delete({ where: { id: job.id } });
  }

  console.log("Cleanup complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
