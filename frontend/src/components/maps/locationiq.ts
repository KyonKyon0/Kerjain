const getApiKey = () => process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || "";

export interface LocationIQFeature {
  lat: number;
  lon: number;
  formatted: string;
  city?: string;
  state?: string;
  country?: string;
  suburb?: string;
}

/**
 * Forward Geocoding: Convert address string to coordinates & detail
 * https://us1.locationiq.com/v1/search?key=YOUR_API_KEY&q=ADDRESS&format=json
 */
export async function searchAddress(text: string): Promise<LocationIQFeature[]> {
  if (!text || !text.trim()) return [];
  const url = `https://us1.locationiq.com/v1/search?key=${getApiKey()}&q=${encodeURIComponent(text)}&format=json`;

  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      formatted: item.display_name,
      city: item.address?.city || item.address?.town || item.address?.village,
      state: item.address?.state,
      country: item.address?.country,
      suburb: item.address?.suburb,
    }));
  } catch (error) {
    console.error("LocationIQ searchAddress error:", error);
    return [];
  }
}

/**
 * Reverse Geocoding: Convert lat, lon to structured address detail
 * https://us1.locationiq.com/v1/reverse?key=YOUR_API_KEY&lat=LAT&lon=LON&format=json
 */
export async function reverseGeocode(lat: number, lon: number): Promise<LocationIQFeature | null> {
  const url = `https://us1.locationiq.com/v1/reverse?key=${getApiKey()}&lat=${lat}&lon=${lon}&format=json`;

  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    if (!res.ok) return null;
    const item = await res.json();
    return {
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      formatted: item.display_name,
      city: item.address?.city || item.address?.town || item.address?.village,
      state: item.address?.state,
      country: item.address?.country,
      suburb: item.address?.suburb,
    };
  } catch (error) {
    console.error("LocationIQ reverseGeocode error:", error);
    return null;
  }
}

/**
 * Autocomplete: Fast location query suggestions with limit
 * https://api.locationiq.com/v1/autocomplete?key=YOUR_API_KEY&q=QUERY&limit=5&dedupe=1
 */
export async function autocompleteAddress(query: string, limit = 5): Promise<LocationIQFeature[]> {
  if (!query || !query.trim()) return [];
  const url = `https://api.locationiq.com/v1/autocomplete?key=${getApiKey()}&q=${encodeURIComponent(query)}&limit=${limit}&dedupe=1`;

  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      formatted: item.display_name,
      city: item.address?.city || item.address?.town || item.address?.village,
      state: item.address?.state,
      country: item.address?.country,
      suburb: item.address?.suburb,
    }));
  } catch (error) {
    console.error("LocationIQ autocompleteAddress error:", error);
    return [];
  }
}

/**
 * Detect User Location via IP
 * Since LocationIQ doesn't have a free IP lookup, we use a generic free one like ipapi.co
 */
export async function detectLocationViaIP(): Promise<LocationIQFeature | null> {
  try {
    const res = await fetch("https://ipwho.is/");
    if (!res.ok) throw new Error(`IPAPI error: ${res.statusText}`);
    const data = await res.json();
    
    if (data && data.success && data.latitude) {
      return {
        lat: data.latitude,
        lon: data.longitude,
        formatted: `${data.city}, ${data.region}, ${data.country}`,
        city: data.city,
        state: data.region,
        country: data.country,
      };
    }
    // Fallback static Jakarta coordinates if IP detection fails completely
    return {
      lat: -6.2088,
      lon: 106.8456,
      formatted: "Jakarta, Indonesia (Fallback)",
      city: "Jakarta",
      country: "Indonesia"
    };
  } catch (error) {
    console.error("IP Geolocation error:", error);
    // Hard fallback to Jakarta so it never crashes
    return {
      lat: -6.2088,
      lon: 106.8456,
      formatted: "Jakarta, Indonesia (Fallback)",
      city: "Jakarta",
      country: "Indonesia"
    };
  }
}

/**
 * Get Directions & Distance between two coordinates
 * https://us1.locationiq.com/v1/directions/driving/lon1,lat1;lon2,lat2?key=YOUR_API_KEY&steps=true&alternatives=true&geometries=polyline&overview=full
 */
export async function getDirections(lat1: number, lon1: number, lat2: number, lon2: number) {
  const url = `https://us1.locationiq.com/v1/directions/driving/${lon1},${lat1};${lon2},${lat2}?key=${getApiKey()}&steps=true&alternatives=false&geometries=polyline&overview=full`;
  
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distanceKm: route.distance / 1000,
        durationMinutes: route.duration / 60,
        geometry: route.geometry, // encoded polyline string
      };
    }
    return null;
  } catch (error) {
    console.error("LocationIQ getDirections error:", error);
    return null;
  }
}

/**
 * Decode Polyline into array of LatLngs for Leaflet
 */
export function decodePolyline(str: string, precision = 5) {
  let index = 0, lat = 0, lng = 0, coordinates = [], shift = 0, result = 0, byte = null, latitude_change, longitude_change, factor = Math.pow(10, precision);

  while (index < str.length) {
      byte = null; shift = 0; result = 0;
      do {
          byte = str.charCodeAt(index++) - 63;
          result |= (byte & 0x1f) << shift;
          shift += 5;
      } while (byte >= 0x20);
      latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
      shift = result = 0;
      do {
          byte = str.charCodeAt(index++) - 63;
          result |= (byte & 0x1f) << shift;
          shift += 5;
      } while (byte >= 0x20);
      longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += latitude_change;
      lng += longitude_change;
      coordinates.push([lat / factor, lng / factor]);
  }
  return coordinates;
}
