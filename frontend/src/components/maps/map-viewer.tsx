"use client";

import React from "react";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
// Removed geoapify getStaticMapUrl import

interface MapViewerProps {
  lat: number;
  lon: number;
  address?: string;
  zoom?: number;
  height?: string;
  className?: string;
}

export function MapViewer({
  lat,
  lon,
  address,
  zoom = 15,
  height = "h-48",
  className = "",
}: MapViewerProps) {
  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const staticMapUrl = `https://maps.locationiq.com/v3/staticmap?key=${apiKey}&center=${lat},${lon}&zoom=${zoom}&size=600x300&markers=icon:large-green-cutout|${lat},${lon}`;

  return (
    <div className={`relative group rounded-xl border border-border overflow-hidden bg-muted shadow-sm ${className}`}>
      {apiKey && staticMapUrl ? (
        <img
          src={staticMapUrl}
          alt={address || "Peta Lokasi"}
          className={`w-full ${height} object-cover group-hover:scale-105 transition-transform duration-300`}
        />
      ) : (
        <div className={`w-full ${height} flex flex-col items-center justify-center p-4 bg-secondary/50 text-center`}>
          <MapPin className="w-8 h-8 text-primary mb-1 animate-bounce" />
          <p className="text-xs font-semibold text-foreground">Peta Lokasi</p>
          {address && <p className="text-[11px] text-muted-foreground truncate max-w-xs">{address}</p>}
        </div>
      )}

      {address && (
        <div className="absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm flex items-center justify-between">
          <span className="text-[11px] font-medium text-foreground truncate pr-2">
            📍 {address}
          </span>
        </div>
      )}
    </div>
  );
}
