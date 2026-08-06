import { DashboardCard } from "./DashboardCard";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  title: string;
  time: string;
  role: string;
}

interface ActivityCardProps {
  activities: Activity[];
}

export function ActivityCard({ activities }: ActivityCardProps) {
  return (
    <DashboardCard className="p-0 overflow-hidden">
      <div className="p-5 border-b bg-muted/20">
        <h3 className="font-semibold">Aktivitas Terakhir</h3>
      </div>
      <div className="divide-y">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-muted/50 transition-colors flex gap-4">
            <div className={cn(
              "w-2 h-2 rounded-full mt-2 shrink-0", 
              activity.role === "consumer" ? "bg-blue-500" : "bg-green-500"
            )} />
            <div>
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" /> {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
