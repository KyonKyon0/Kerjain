import React, { useState, useEffect } from "react";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, X, Download, ZoomIn } from "lucide-react";

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
    (lowerContent.startsWith("http://") || lowerContent.startsWith("https://") || lowerContent.startsWith("/")) &&
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(lowerContent)
  ) {
    return true;
  }
  return false;
}

export const ChatBubble = React.memo(function ChatBubble({ message, isMe }: ChatBubbleProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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

  // Close on Escape key press
  useEffect(() => {
    if (!isPreviewOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPreviewOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewOpen]);

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
    <>
      <div className={cn("flex w-full my-2 animate-in fade-in slide-in-from-bottom-2 duration-300", isMe ? "justify-end" : "justify-start")}>
        <div
          className={cn(
            "max-w-[75%] md:max-w-[60%] rounded-2xl relative group overflow-hidden",
            isImage ? "p-1" : "px-4 py-2",
            isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
          )}
        >
          {isImage ? (
            <div className="relative group/img cursor-pointer overflow-hidden rounded-xl" onClick={() => setIsPreviewOpen(true)}>
              <img
                src={message.content}
                alt="Foto Percakapan"
                className="max-w-full rounded-xl max-h-[300px] object-contain group-hover/img:scale-[1.02] transition-transform duration-200"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="p-2 rounded-full bg-black/60 text-white backdrop-blur-sm">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>
            </div>
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

      {/* In-App Fullscreen Photo Lightbox Modal (Solves blank page issue for base64 / blob / urls) */}
      {isPreviewOpen && isImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-3 z-10" onClick={(e) => e.stopPropagation()}>
            <a
              href={message.content}
              download={`foto-chat-${message.id || Date.now()}.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-colors flex items-center justify-center cursor-pointer shadow-lg"
              title="Unduh / Simpan Foto"
            >
              <Download className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-colors flex items-center justify-center cursor-pointer shadow-lg"
              title="Tutup (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image Container */}
          <div 
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={message.content}
              alt="Foto Percakapan Layar Penuh"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 select-none"
            />
          </div>

          {/* Bottom Timestamp */}
          {time && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 text-xs font-medium pointer-events-none">
              Dikirim pada {time}
            </div>
          )}
        </div>
      )}
    </>
  );
});
