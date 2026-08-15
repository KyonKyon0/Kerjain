"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, Image as ImageIcon, ZoomIn, Clock, FileText } from "lucide-react";
import { formatWIBDateTime } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProgressLog {
  id: string;
  statusSnapshot?: string;
  status_snapshot?: string;
  note?: string | null;
  photoUrl?: string | null;
  photo_url?: string | null;
  createdAt?: string;
  created_at?: string;
}

interface JobProgressGalleryProps {
  logs: ProgressLog[];
  className?: string;
}

export function JobProgressGallery({ logs, className }: JobProgressGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    note?: string | null;
    time?: string;
    status?: string;
  } | null>(null);

  // Filter logs that contain valid photoUrl
  const photoLogs = logs.filter(
    (log) => (log.photoUrl && log.photoUrl.trim() !== "") || (log.photo_url && log.photo_url.trim() !== "")
  );

  if (photoLogs.length === 0) {
    return null;
  }

  return (
    <div className="border border-border/80 rounded-3xl p-5 bg-card/90 backdrop-blur-md shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Camera className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-foreground">
            Dokumentasi & Foto Hasil ({photoLogs.length})
          </h4>
        </div>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
          Tersinkronisasi
        </span>
      </div>

      {/* Grid of photo thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photoLogs.map((log, index) => {
          const photoUrl = log.photoUrl || log.photo_url || "";
          const timestamp = log.createdAt || log.created_at;
          const status = log.statusSnapshot || log.status_snapshot || "Progres";

          return (
            <motion.div
              key={log.id || index}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                setSelectedPhoto({
                  url: photoUrl,
                  note: log.note,
                  time: timestamp ? formatWIBDateTime(timestamp) : undefined,
                  status,
                })
              }
              className="group relative aspect-square rounded-2xl overflow-hidden border border-border/80 bg-muted/40 cursor-pointer shadow-sm"
            >
              <img
                src={photoUrl}
                alt="Foto progres pekerjaan"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <ZoomIn className="w-6 h-6 drop-shadow-md" />
              </div>

              {/* Bottom Caption Pill */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 p-1.5 bg-black/60 backdrop-blur-sm rounded-xl text-white text-[10px] truncate">
                {log.note || status}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full-size Photo Preview Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-md p-4 rounded-3xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl">
          {selectedPhoto && (
            <div className="space-y-3">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/50 border border-border/60">
                <img
                  src={selectedPhoto.url}
                  alt="Detail foto pekerjaan"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-3 bg-muted/40 rounded-2xl border border-border/50 space-y-1.5">
                {selectedPhoto.note && (
                  <div className="flex items-start gap-2 text-xs font-semibold text-foreground">
                    <FileText className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                    <span>{selectedPhoto.note}</span>
                  </div>
                )}
                {selectedPhoto.time && (
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3 text-primary shrink-0" />
                    <span>Diambil: {selectedPhoto.time}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
