const TO_RAD = Math.PI / 180;
const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculates the great-circle distance between two points (in meters) using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const dLatHalf = (lat2 - lat1) * TO_RAD * 0.5;
  const dLonHalf = (lon2 - lon1) * TO_RAD * 0.5;
  const sinDLat = Math.sin(dLatHalf);
  const sinDLon = Math.sin(dLonHalf);
  const a =
    sinDLat * sinDLat +
    Math.cos(lat1 * TO_RAD) *
      Math.cos(lat2 * TO_RAD) *
      sinDLon *
      sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_METERS * c); // Distance in meters
}

/**
 * Format distance in user-friendly Indonesian format (e.g. "850 m" or "2,4 km")
 */
export function formatDistanceString(distanceInMeters: number | null | undefined): string | null {
  if (distanceInMeters === null || distanceInMeters === undefined || isNaN(distanceInMeters) || distanceInMeters <= 0) {
    return null;
  }

  // Under 1 km -> in meters
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }

  // Under 50 km -> in km with 1 decimal
  if (distanceInMeters <= 50000) {
    const km = distanceInMeters / 1000;
    return `${km.toFixed(1)} km`;
  }

  // Far away (e.g. other cities / mock data)
  if (distanceInMeters <= 100000) {
    const km = Math.round(distanceInMeters / 1000);
    return `${km} km`;
  }

  return "> 99 km";
}

/**
 * Estimates motorcycle travel time in minutes based on distance
 */
export function estimateTravelTime(distanceInMeters: number | null | undefined): string {
  if (!distanceInMeters || isNaN(distanceInMeters) || distanceInMeters <= 0) return "";
  
  // Average urban speed ~ 25 km/h = ~ 400 meters per minute + 2 min buffer
  const minutes = Math.max(1, Math.round(distanceInMeters / 400 + 2));
  if (minutes < 60) {
    return `± ${minutes} menit perjalanan`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMin = minutes % 60;
  return `± ${hours} jam ${remainingMin > 0 ? `${remainingMin} mnt` : ""}`;
}
