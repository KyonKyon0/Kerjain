import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
  isMe: boolean;
}

export function ChatBubble({ message, isMe }: ChatBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });

  if (message.type === "SYSTEM") {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted px-4 py-1.5 rounded-full text-xs text-muted-foreground font-medium text-center max-w-[80%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full my-2 animate-in fade-in slide-in-from-bottom-2 duration-300", isMe ? "justify-end" : "justify-start")}>
      <div 
        className={cn(
          "max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2 relative group",
          isMe 
            ? "bg-primary text-primary-foreground rounded-br-sm" 
            : "bg-muted text-foreground rounded-bl-sm"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        <div className={cn("flex items-center justify-end gap-1 mt-1", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>
          <span className="text-[10px]">{time}</span>
          {isMe && (
            message.read ? <CheckCheck className="w-3 h-3 text-blue-300" /> : <Check className="w-3 h-3" />
          )}
        </div>
      </div>
    </div>
  );
}

