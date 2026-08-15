"use client";

import { useState, useEffect } from "react";

interface UserLocation {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export function useUserLocation(): UserLocation {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setError("Geolokasi tidak didukung oleh browser Anda");
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn("Geolocation warning:", err.message);
        // Default fallback to Jakarta center coordinates if GPS permission is denied or pending
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { lat, lng, loading, error, requestLocation };
}
