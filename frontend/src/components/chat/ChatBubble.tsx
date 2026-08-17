import React from "react";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
  isMe: boolean;
}

// Detect if a string is an image (base64 data URL or http image URL)
function isImageContent(content: string): boolean {
  if (!content || typeof content !== "string") return false;
  if (content.startsWith("data:image")) return true;
  // Also detect common image URLs
  const lowerContent = content.trim().toLowerCase();
  if (
    (lowerContent.startsWith("http://") || lowerContent.startsWith("https://")) &&
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(lowerContent)
  ) {
    return true;
  }
  return false;
}

export const ChatBubble = React.memo(function ChatBubble({ message, isMe }: ChatBubbleProps) {
  let time = "";
  try {
    const rawDate = message.createdAt || (message as any).created_at;
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        time = parsed.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      }
    }
  } catch {
    time = "";
  }

  const isImage = isImageContent(message.content);

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
          "max-w-[75%] md:max-w-[60%] rounded-2xl relative group overflow-hidden",
          isImage ? "p-1" : "px-4 py-2",
          isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
        )}
      >
        {isImage ? (
          <img
            src={message.content}
            alt="Foto"
            className="max-w-full rounded-xl max-h-[300px] object-contain cursor-pointer"
            loading="lazy"
            onClick={() => window.open(message.content, "_blank")}
          />
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        )}
        <div className={cn(
          "flex items-center justify-end gap-1 mt-1",
          isImage ? "px-2 pb-1" : "",
          isMe ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {time && <span className="text-[10px]">{time}</span>}
          {isMe && (message.read ? <CheckCheck className="w-3 h-3 text-blue-300" /> : <Check className="w-3 h-3" />)}
        </div>
      </div>
    </div>
  );
});
