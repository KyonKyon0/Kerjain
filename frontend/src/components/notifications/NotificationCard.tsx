import { Notification } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, MessageSquare, CreditCard, RefreshCw, Bell } from "lucide-react";
import Link from "next/link";

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const time = new Date(notification.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });

  const getIcon = () => {
    switch (notification.type) {
      case "JOB_ACCEPTED": return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case "STATUS_CHANGED": return <RefreshCw className="w-5 h-5 text-amber-500" />;
      case "NEW_MESSAGE": return <MessageSquare className="w-5 h-5 text-primary" />;
      case "PAYMENT": return <CreditCard className="w-5 h-5 text-green-500" />;
      case "JOB_COMPLETED": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const Content = (
    <div 
      onClick={onClick}
      className={cn(
        "flex gap-3 p-4 transition-colors hover:bg-muted/50 w-full text-left cursor-pointer",
        !notification.read && "bg-primary/5"
      )}
    >
      <div className="shrink-0 mt-1">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium leading-tight", !notification.read && "font-bold text-primary")}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.description}</p>
        <p className="text-[10px] text-muted-foreground mt-2">{time}</p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
      )}
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link} className="block border-b last:border-0">{Content}</Link>;
  }

  return <div className="border-b last:border-0">{Content}</div>;
}

