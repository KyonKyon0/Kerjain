"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, Navigation } from "lucide-react";
import { LocationData } from "./location-picker";
import { detectLocationViaIP, reverseGeocode, getDirections, decodePolyline } from "./locationiq";

interface InteractiveMapProps {
  initialLat?: number;
  initialLon?: number;
  targetLat?: number;
  targetLon?: number;
  onLocationSelected: (loc: LocationData) => void;
  className?: string;
}

export default function InteractiveMap({
  initialLat = -6.1754,
  initialLon = 106.8272,
  targetLat,
  targetLon,
  onLocationSelected,
  className = "w-full h-[60vh] min-h-[400px]",
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const targetMarkerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [addressPreview, setAddressPreview] = useState("Memuat peta...");
  const [routeInfo, setRouteInfo] = useState<{distance: number, duration: number} | null>(null);
  
  // Sync map position if external props change (e.g., from search input)
  useEffect(() => {
    if (leafletMapRef.current && markerRef.current && !targetLat) {
      leafletMapRef.current.setView([initialLat, initialLon], 15);
      markerRef.current.setLatLng([initialLat, initialLon]);
      updateLocationInfo(initialLat, initialLon);
    }
  }, [initialLat, initialLon, targetLat]);

  // Handle Routing if target is provided
  useEffect(() => {
    if (!leafletMapRef.current || !targetLat || !targetLon) return;

    const L = (window as any).L;
    if (!L) return;

    const fetchRoute = async () => {
      setLoading(true);
      
      // Target Marker
      if (!targetMarkerRef.current) {
        const targetIcon = L.icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
        targetMarkerRef.current = L.marker([targetLat, targetLon], { icon: targetIcon }).addTo(leafletMapRef.current);
      } else {
        targetMarkerRef.current.setLatLng([targetLat, targetLon]);
      }

      const routeData = await getDirections(initialLat, initialLon, targetLat, targetLon);
      
      if (routeData) {
        setRouteInfo({ distance: routeData.distanceKm, duration: routeData.durationMinutes });
        const latLngs = decodePolyline(routeData.geometry);
        
        if (routePolylineRef.current) {
          routePolylineRef.current.setLatLngs(latLngs);
        } else {
          routePolylineRef.current = L.polyline(latLngs, { color: '#3b82f6', weight: 5, opacity: 0.8 }).addTo(leafletMapRef.current);
        }
        
        // Fit bounds to show both A and B
        leafletMapRef.current.fitBounds(L.latLngBounds([initialLat, initialLon], [targetLat, targetLon]), { padding: [50, 50] });
      }
      setLoading(false);
    };

    fetchRoute();
  }, [initialLat, initialLon, targetLat, targetLon]);

  // Import leaflet CSS and initialize map only on client
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    
    // Dynamically load leaflet and its CSS to avoid SSR issues
    const initMap = async () => {
      try {
        await import("leaflet/dist/leaflet.css");
        const L = (await import("leaflet")).default;

        // Custom Icon because default icon path is often broken in Webpack/Next.js
        const customIcon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });

        if (!leafletMapRef.current) {
          // Initialize map
          leafletMapRef.current = L.map(mapRef.current!).setView([initialLat, initialLon], 15);

          // Add OSM tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
          }).addTo(leafletMapRef.current);

          // Add marker
          markerRef.current = L.marker([initialLat, initialLon], { icon: customIcon }).addTo(leafletMapRef.current);

          // Initial Reverse Geocode
          // Only do this if it's the very first load to prevent double-fetching,
          // but we already have the sync useEffect handling the initial props.
          
          // Handle map clicks
          leafletMapRef.current.on("click", (e: any) => {
            const { lat, lng } = e.latlng;
            markerRef.current.setLatLng([lat, lng]);
            leafletMapRef.current.panTo([lat, lng]);
            updateLocationInfo(lat, lng);
          });
          
          // Handle built-in geolocation success
          leafletMapRef.current.on("locationfound", (e: any) => {
            const { lat, lng } = e.latlng;
            markerRef.current.setLatLng([lat, lng]);
            leafletMapRef.current.setView([lat, lng], 16);
            updateLocationInfo(lat, lng);
            setLoading(false);
          });

          // Handle built-in geolocation error
          leafletMapRef.current.on("locationerror", async (e: any) => {
            console.warn("Browser GPS failed or blocked", e);
            
            if (e.message && e.message.includes("secure origins")) {
               alert("Browser menolak fitur GPS karena Anda mengakses web ini lewat HTTP LAN (192.168.x.x) bukan HTTPS. Untuk mendapatkan pop-up izin GPS di HP, Anda harus menggunakan HTTPS atau localhost.");
            } else {
               alert("Gagal melacak GPS. Pastikan izin lokasi (GPS) diaktifkan di browser Anda.");
            }
            
            setAddressPreview("Lokasi tidak ditemukan (Akses GPS ditolak)");
            setLoading(false);
          });
        }
      } catch (err) {
        console.error("Leaflet initialization failed", err);
      }
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const updateLocationInfo = async (lat: number, lon: number) => {
    setLoading(true);
    setAddressPreview("Mengambil detail alamat...");
    try {
      const feature = await reverseGeocode(lat, lon);
      let addr = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
      let locData: LocationData = { address: addr, lat, lon };

      if (feature) {
        addr = feature.formatted;
        locData = {
          address: addr,
          lat,
          lon,
          city: feature.city,
          state: feature.state,
          suburb: feature.suburb,
        };
      }
      setAddressPreview(addr);
      onLocationSelected(locData);
    } catch (error) {
      console.error(error);
      setAddressPreview("Gagal mengambil alamat");
    } finally {
      setLoading(false);
    }
  };

  const requestBrowserLocation = () => {
    if (leafletMapRef.current) {
      setLoading(true);
      setAddressPreview("Mencari sinyal GPS Anda...");
      // This will trigger the browser permission popup!
      leafletMapRef.current.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border flex flex-col">
      {/* Map Container */}
      <div className="relative w-full">
        <div ref={mapRef} className={`z-0 ${className}`}></div>

        {/* Floating Overlays */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
          {!targetLat && (
            <button
              type="button"
              onClick={requestBrowserLocation}
              className="p-3 bg-background border border-border shadow-lg rounded-full text-primary hover:bg-muted transition-colors flex items-center justify-center"
              title="Deteksi Lokasi Saya via GPS Browser"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Info Banner (Static, not floating) */}
      <div className="w-full bg-background p-4 border-t border-border">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Lokasi Titik Peta</span>
          <p className="text-sm font-medium text-foreground pr-8 leading-snug">
            {addressPreview}
          </p>
          {routeInfo && (
            <div className="mt-2 flex gap-4 text-xs font-semibold text-blue-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
              <span>🚗 Jarak: {routeInfo.distance.toFixed(1)} km</span>
              <span>⏱️ Estimasi: {Math.ceil(routeInfo.duration)} menit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
