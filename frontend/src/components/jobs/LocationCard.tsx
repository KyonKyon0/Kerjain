"use client";

import React from "react";
import { MapPin, Navigation, Compass, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapViewer } from "@/components/maps";
import { useUserLocation } from "@/hooks/useUserLocation";
import { calculateHaversineDistance, formatDistanceString, estimateTravelTime } from "@/lib/distance";

interface LocationCardProps {
  address: string;
  latitude: number | null;
  longitude: number | null;
  className?: string;
}

export function LocationCard({ address, latitude, longitude, className }: LocationCardProps) {
  const { lat: userLat, lng: userLng, loading: userLocLoading } = useUserLocation();

  // Calculate real distance if both user and job coordinates are available
  const distanceInMeters = (latitude && longitude && userLat && userLng)
    ? calculateHaversineDistance(userLat, userLng, latitude, longitude)
    : null;

  const distanceText = formatDistanceString(distanceInMeters);
  const travelTimeText = estimateTravelTime(distanceInMeters);

  const googleMapsRouteUrl = (latitude && longitude)
    ? (userLat && userLng
        ? `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${latitude},${longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)
    : "#";

  return (
    <div className={cn("border border-border/80 rounded-3xl p-5 bg-card/90 backdrop-blur-md shadow-sm space-y-4", className)}>
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-primary/10 text-primary rounded-2xl shrink-0 border border-primary/20">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="overflow-hidden flex-1">
          <h4 className="font-bold text-base text-foreground mb-0.5">Lokasi Pekerjaan</h4>
          <p className="text-xs text-muted-foreground leading-relaxed break-words">{address}</p>
        </div>
      </div>

      {/* Distance & Travel Time Header for Partner */}
      {distanceInMeters !== null && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
              Jarak: ± {distanceText} dari Anda
            </span>
          </div>
          {travelTimeText && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-background/80 px-2.5 py-0.5 rounded-full shadow-sm">
              {travelTimeText}
            </span>
          )}
        </div>
      )}

      {latitude && longitude ? (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden border border-border/60 shadow-inner">
            <MapViewer
              lat={latitude}
              lon={longitude}
              address={address}
              height="h-48"
            />
          </div>

          <a 
            href={googleMapsRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-bold text-xs rounded-2xl hover:bg-emerald-600 transition-all shadow-md shadow-primary/20 group"
          >
            <Route className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Buka Petunjuk Arah / Rute di Google Maps
          </a>
        </div>
      ) : (
        <div className="w-full h-32 bg-muted/30 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground p-4 text-center">
          <MapPin className="w-6 h-6 opacity-40 text-muted-foreground" />
          <span>Titik koordinat peta otomatis dari alamat pemosting</span>
        </div>
      )}
    </div>
  );
}
