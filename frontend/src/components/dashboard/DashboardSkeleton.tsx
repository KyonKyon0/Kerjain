import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "./PageContainer";

export function DashboardSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[400px] rounded-2xl md:col-span-1 lg:col-span-4" />
          <Skeleton className="h-[400px] rounded-2xl md:col-span-1 lg:col-span-3" />
        </div>
      </div>
    </PageContainer>
  );
}
