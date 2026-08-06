import { useState, useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleSend = () => {
    if (content.trim() && !disabled) {
      onSendMessage(content.trim());
      setContent("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-background border-t pb-safe">
      <div className="max-w-4xl mx-auto flex items-end gap-2 bg-muted/30 p-2 rounded-2xl border focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ketik pesan... (Shift+Enter untuk baris baru)"
          className="flex-1 max-h-[120px] bg-transparent resize-none outline-none text-sm p-2 scrollbar-thin"
          rows={1}
        />
        <Button 
          onClick={handleSend} 
          disabled={!content.trim() || disabled}
          size="icon"
          className="rounded-xl h-10 w-10 shrink-0 mb-0.5"
        >
          <SendHorizontal className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
