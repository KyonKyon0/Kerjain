"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Check, X, Move, Sparkles, RefreshCw } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCropComplete: (croppedDataUrl: string) => void;
}

const VIEWPORT_SIZE = 260; // 260px circular viewport in UI
const OUTPUT_SIZE = 360;   // 360x360px crisp avatar export

export function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ pointerX: number; pointerY: number; posX: number; posY: number }>({
    pointerX: 0,
    pointerY: 0,
    posX: 0,
    posY: 0
  });

  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 1, height: 1 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Load natural dimensions when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new window.Image();
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 });
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc, isOpen]);

  // Calculate base scale to fill (cover) the circular viewport
  const isRotatedQuarter = rotation === 90 || rotation === 270;
  const effectiveNatWidth = isRotatedQuarter ? naturalSize.height : naturalSize.width;
  const effectiveNatHeight = isRotatedQuarter ? naturalSize.width : naturalSize.height;

  const baseScale = Math.max(
    VIEWPORT_SIZE / effectiveNatWidth,
    VIEWPORT_SIZE / effectiveNatHeight
  );

  const displayedWidth = naturalSize.width * baseScale * zoom;
  const displayedHeight = naturalSize.height * baseScale * zoom;

  const currentEffectiveWidth = isRotatedQuarter ? displayedHeight : displayedWidth;
  const currentEffectiveHeight = isRotatedQuarter ? displayedWidth : displayedHeight;

  // Max drag boundary so image covers the circular frame naturally like smartphone gallery
  const maxDragX = Math.max(0, (currentEffectiveWidth - VIEWPORT_SIZE) / 2);
  const maxDragY = Math.max(0, (currentEffectiveHeight - VIEWPORT_SIZE) / 2);

  // Clamp helper
  const clampPos = useCallback((x: number, y: number) => {
    return {
      x: Math.max(-maxDragX, Math.min(maxDragX, x)),
      y: Math.max(-maxDragY, Math.min(maxDragY, y))
    };
  }, [maxDragX, maxDragY]);

  // Handle pointer down (mouse / touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    setDragStart({
      pointerX: e.clientX,
      pointerY: e.clientY,
      posX: position.x,
      posY: position.y
    });
  };

  // Handle pointer move with 1:1 natural pixel drag mapping
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.pointerX;
    const deltaY = e.clientY - dragStart.pointerY;
    const nextPos = clampPos(dragStart.posX + deltaX, dragStart.posY + deltaY);
    setPosition(nextPos);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      setIsDragging(false);
    }
  };

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.max(1, Math.min(3, prev + zoomDelta)));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    setPosition({ x: 0, y: 0 }); // Re-center on rotation
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Extract exactly what is visible in the circular frame onto canvas
  const handleCrop = useCallback(() => {
    if (!imageRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // High quality bicubic filtering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const canvasScale = OUTPUT_SIZE / VIEWPORT_SIZE;

    // Center translation on canvas
    ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    const targetWidth = displayedWidth * canvasScale;
    const targetHeight = displayedHeight * canvasScale;

    // Position offset scaled to output canvas
    // Account for rotation orientation
    let drawOffsetX = position.x * canvasScale;
    let drawOffsetY = position.y * canvasScale;

    if (rotation === 90) {
      const temp = drawOffsetX;
      drawOffsetX = drawOffsetY;
      drawOffsetY = -temp;
    } else if (rotation === 180) {
      drawOffsetX = -drawOffsetX;
      drawOffsetY = -drawOffsetY;
    } else if (rotation === 270) {
      const temp = drawOffsetX;
      drawOffsetX = -drawOffsetY;
      drawOffsetY = temp;
    }

    ctx.drawImage(
      imageRef.current,
      drawOffsetX - targetWidth / 2,
      drawOffsetY - targetHeight / 2,
      targetWidth,
      targetHeight
    );

    // Ultra-lightweight, crisp JPEG format
    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
    onCropComplete(croppedDataUrl);
    onClose();
  }, [position, rotation, displayedWidth, displayedHeight, onCropComplete, onClose]);

  if (!imageSrc) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card rounded-3xl border border-border/80 shadow-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-border/60">
          <DialogTitle className="text-lg font-extrabold flex items-center gap-2 text-foreground">
            <Sparkles className="w-5 h-5 text-primary" /> Sesuaikan Bagian Foto Profil
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Geser dan perbesar foto. Bagian di dalam lingkaran adalah yang akan menjadi foto profil Anda.
          </p>
        </DialogHeader>

        <div className="p-6 flex flex-col items-center select-none bg-muted/20">
          
          {/* Crop Container Viewport (Phone Gallery Style) */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className="relative w-[260px] h-[260px] overflow-hidden rounded-2xl bg-black cursor-grab active:cursor-grabbing touch-none select-none flex items-center justify-center border shadow-inner"
          >
            {/* Rendered Image with Transform */}
            <div
              style={{
                width: `${displayedWidth}px`,
                height: `${displayedHeight}px`,
                transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.08s ease-out"
              }}
              className="absolute pointer-events-none flex items-center justify-center"
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                className="w-full h-full object-cover max-w-none pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Circular Dark Mask Overlay (Exactly like WhatsApp / Gallery) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div 
                className="w-[260px] h-[260px] rounded-full border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] ring-4 ring-primary/30"
              />
            </div>

            {/* Center Hint Icon */}
            {!isDragging && position.x === 0 && position.y === 0 && zoom === 1 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="bg-black/60 px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                  <Move className="w-3.5 h-3.5" /> Geser Foto
                </div>
              </div>
            )}
          </div>

          <p className="text-[11px] font-bold text-muted-foreground mt-3 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-primary" /> Sentuh & geser untuk memposisikan wajah / objek
          </p>

          {/* Controls Bar (Zoom, Rotate, Reset) */}
          <div className="w-full space-y-3 mt-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(1, prev - 0.2))}
                className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Perkecil"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <div className="flex-1 px-1">
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer border border-border/60"
                />
              </div>

              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
                className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Perbesar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleRotate}
                className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-primary transition-colors flex items-center gap-1 text-xs font-bold"
                title="Putar 90 Derajat"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Reset Posisi"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 pt-0 gap-2 sm:gap-0 flex-row justify-end bg-muted/20 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none rounded-2xl h-11 font-bold text-xs"
          >
            <X className="w-4 h-4 mr-1.5" /> Batal
          </Button>
          <Button
            type="button"
            onClick={handleCrop}
            className="flex-1 sm:flex-none rounded-2xl h-11 font-extrabold text-xs bg-primary hover:bg-emerald-600 shadow-md shadow-primary/20 text-white"
          >
            <Check className="w-4 h-4 mr-1.5 stroke-[2.5]" /> Gunakan Foto Ini
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
