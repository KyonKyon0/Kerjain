"use client";

import React, { useState } from "react";
import { LocationPicker, MapViewer, LocationData, searchAddress } from "@/components/maps";
import { MapPin, Search, Navigation, Compass, Globe, Sparkles } from "lucide-react";

export default function MapsDemoPage() {
  const [selectedLoc, setSelectedLoc] = useState<LocationData | null>({
    address: "Jakarta Convention Center, Senayan, Jakarta",
    lat: -6.2146,
    lon: 106.8074,
    city: "Jakarta Pusat",
  });

  const [searchQuery, setSearchQuery] = useState("Monas Jakarta");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    const results = await searchAddress(searchQuery);
    setSearchResults(results);
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Geoapify Maps Integration
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Peta & Pencari Lokasi Dinamis</h1>
        <p className="text-sm text-muted-foreground">
          Komponen reusable <code className="bg-muted px-1.5 py-0.5 rounded text-primary">/components/maps</code> dengan
          API Key yang disetting di <code className="bg-muted px-1.5 py-0.5 rounded">.env.local</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Dynamic LocationPicker */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">1. LocationPicker (Autocomplete & GPS)</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Ketik nama tempat untuk autokomplit atau klik &quot;Lokasi Saya&quot; untuk deteksi GPS otomatis via reverse geocoding.
          </p>

          <LocationPicker
            initialLocation={selectedLoc || undefined}
            onLocationSelect={(loc) => setSelectedLoc(loc)}
            placeholder="Cari jalan, gedung, atau kota..."
            showMapPreview={true}
          />

          {selectedLoc && (
            <div className="p-3 bg-muted/50 rounded-xl border border-border/60 text-xs space-y-1">
              <p className="font-semibold text-foreground">Detail Data Terpilih:</p>
              <p><span className="text-muted-foreground">Alamat:</span> {selectedLoc.address}</p>
              <p><span className="text-muted-foreground">Koordinat:</span> {selectedLoc.lat}, {selectedLoc.lon}</p>
            </div>
          )}
        </div>

        {/* Section 2: Reusable MapViewer */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">2. MapViewer (Static Map & Overlay)</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Menampilkan peta statis dengan efek hover custom:
            <code className="block mt-1 p-1 bg-muted text-[10px] rounded font-mono text-primary truncate">
              class=&quot;absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm&quot;
            </code>
          </p>

          <MapViewer
            lat={selectedLoc?.lat || -6.2146}
            lon={selectedLoc?.lon || 106.8074}
            address={selectedLoc?.address || "Jakarta Convention Center"}
            height="h-56"
          />
        </div>
      </div>

      {/* Section 3: Geocode Search API Demo */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">3. Direct Geocode Search Test</h2>
        </div>

        <form onSubmit={handleManualSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lokasi spesifik..."
            className="flex-1 px-3.5 py-2 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            {searching ? "Mencari..." : "Cari"}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Hasil Pencarian ({searchResults.length}):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedLoc({
                      address: item.properties.formatted,
                      lat: item.properties.lat,
                      lon: item.properties.lon,
                    })
                  }
                  className="p-3 bg-muted/40 hover:bg-accent hover:text-accent-foreground border border-border rounded-xl cursor-pointer text-xs transition-colors space-y-1"
                >
                  <p className="font-bold text-foreground truncate">{item.properties.formatted}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Lat: {item.properties.lat.toFixed(4)}, Lon: {item.properties.lon.toFixed(4)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
