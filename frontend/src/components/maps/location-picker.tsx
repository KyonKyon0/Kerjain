"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Navigation, Check, X } from "lucide-react";
import { toast } from "sonner";
import { autocompleteAddress, reverseGeocode, detectLocationViaIP, LocationIQFeature } from "./locationiq";

export interface LocationData {
  address: string;
  lat: number;
  lon: number;
  city?: string;
  suburb?: string;
  state?: string;
}

interface LocationPickerProps {
  initialLocation?: LocationData;
  onLocationSelect?: (location: LocationData) => void;
  placeholder?: string;
  className?: string;
  showMapPreview?: boolean;
}

export function LocationPicker({
  initialLocation,
  onLocationSelect,
  placeholder = "Cari atau pilih lokasi...",
  className = "",
  showMapPreview = true,
}: LocationPickerProps) {
  const [query, setQuery] = useState(initialLocation?.address || "");
  const [suggestions, setSuggestions] = useState<LocationIQFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Autocomplete Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await autocompleteAddress(val, 5);
      setSuggestions(results);
      setLoading(false);
    }, 300);
  };

  // Handle Select Suggestion
  const handleSelectFeature = (feature: LocationIQFeature) => {
    const { formatted, lat, lon, city, suburb, state } = feature;
    const loc: LocationData = {
      address: formatted,
      lat,
      lon,
      city,
      suburb,
      state,
    };

    setSelectedLocation(loc);
    setQuery(formatted);
    setSuggestions([]);
    setIsOpen(false);
    onLocationSelect?.(loc);
  };

  // Detect Current Location using Geolocation API
  const handleDetectLocation = async () => {
    setDetecting(true);

    if (!navigator.geolocation) {
      toast.error("Browser Anda tidak mendukung fitur GPS");
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const feature = await reverseGeocode(latitude, longitude);
        let addr = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
        
        let locData: LocationData = { address: addr, lat: latitude, lon: longitude };

        if (feature) {
          addr = feature.formatted;
          locData = {
            address: addr,
            lat: latitude,
            lon: longitude,
            city: feature.city,
            state: feature.state,
            suburb: feature.suburb,
          };
        }

        setSelectedLocation(locData);
        setQuery(addr);
        onLocationSelect?.(locData);
        setDetecting(false);
        setIsOpen(false);
      },
      (error) => {
        console.warn("GPS error", error);
        if (error.message && error.message.includes("secure origins")) {
           toast.error("Izin GPS diblokir karena tidak menggunakan HTTPS");
        } else {
           toast.error("Gagal mendeteksi lokasi GPS");
        }
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleClear = () => {
    setQuery("");
    setSelectedLocation(null);
    setSuggestions([]);
  };

  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  return (
    <div ref={wrapperRef} className={`relative w-full space-y-3 ${className}`}>
      {/* Input Search Container */}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-muted-foreground pointer-events-none">
          <MapPin className="w-5 h-5 text-primary" />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-2.5 bg-background border border-input rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 hover:bg-muted text-muted-foreground rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={detecting}
            title="Gunakan lokasi saya saat ini"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors disabled:opacity-50"
          >
            {detecting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Lokasi Saya</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {loading && (
            <div className="p-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Mencari alamat...
            </div>
          )}

          {!loading && suggestions.length === 0 && (
            <div className="p-3 text-center text-xs text-muted-foreground">
              Lokasi tidak ditemukan.
            </div>
          )}

          {!loading &&
            suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectFeature(item)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-accent hover:text-accent-foreground text-sm flex items-start gap-2.5 transition-colors border-b border-border/40 last:border-none"
              >
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5 overflow-hidden">
                  <p className="font-medium text-foreground text-xs leading-tight truncate">
                    {item.formatted}
                  </p>
                  {(item.city || item.state || item.country) && (
                    <p className="text-[11px] text-muted-foreground truncate">
                      {[item.suburb, item.city, item.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </button>
            ))}
        </div>
      )}

      {/* Static Map Preview / Selected Badge */}
      {showMapPreview && selectedLocation && (
        <div className="relative group rounded-xl border border-border overflow-hidden bg-muted shadow-sm">
          {apiKey ? (
            <img
              src={`https://maps.locationiq.com/v3/staticmap?key=${apiKey}&center=${selectedLocation.lat},${selectedLocation.lon}&zoom=15&size=600x220&markers=icon:large-green-cutout|${selectedLocation.lat},${selectedLocation.lon}`}
              alt="Preview Lokasi"
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-32 flex flex-col items-center justify-center p-4 bg-muted/60 text-center">
              <MapPin className="w-8 h-8 text-primary mb-1 animate-bounce" />
              <p className="text-xs font-semibold text-foreground">Lokasi Terpilih</p>
              <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                {selectedLocation.address}
              </p>
            </div>
          )}

          <div className="absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm flex items-center justify-between">
            <span className="text-[11px] font-medium text-foreground truncate pr-2">
              📍 {selectedLocation.address}
            </span>
            <span className="text-[10px] text-primary font-bold shrink-0 flex items-center gap-1">
              <Check className="w-3 h-3" /> Terpilih
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
