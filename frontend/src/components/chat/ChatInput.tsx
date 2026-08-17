import { useState, useRef, useEffect, ChangeEvent } from "react";
import { SendHorizontal, ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import imageCompression from "browser-image-compression";

interface ChatInputProps {
  onSendMessage: (content: string, isImage?: boolean) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [content, setContent] = useState<string>("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setIsCompressing(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/jpeg",
      });
      const dataUrl = await toBase64(compressed);
      setPhoto(dataUrl);
    } catch (err) {
      console.error("Error compressing image", err);
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = () => {
    if (disabled) return;
    if (photo) {
      onSendMessage(photo, true);
      setPhoto(null);
    }
    if (content.trim()) {
      onSendMessage(content.trim(), false);
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
    <div className="p-2 sm:p-3 bg-background">
      {/* Photo preview strip */}
      {photo && (
        <div className="max-w-4xl mx-auto mb-2 flex items-center gap-2">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-primary/30 shrink-0">
            <img src={photo} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute top-0 right-0 bg-black/60 text-white rounded-bl-md p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground">Foto siap dikirim</span>
        </div>
      )}

      {/* Input bar */}
      <div className="max-w-4xl mx-auto flex items-end gap-1.5 bg-muted/30 px-2 py-1.5 rounded-2xl border focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
        {/* Gallery icon button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isCompressing || disabled}
          className="shrink-0 p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
          title="Kirim Foto"
        >
          {isCompressing ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <ImagePlus className="w-5 h-5" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoSelect}
        />

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ketik pesan..."
          className="flex-1 max-h-[120px] bg-transparent resize-none outline-none text-sm py-1.5 px-1 scrollbar-thin"
          rows={1}
        />

        <Button
          onClick={handleSend}
          disabled={(!content.trim() && !photo) || disabled}
          size="icon"
          className="rounded-xl h-8 w-8 shrink-0"
        >
          <SendHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
