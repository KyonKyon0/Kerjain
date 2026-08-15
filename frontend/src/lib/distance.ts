/**
 * Calculates the great-circle distance between two points (in meters) using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); // Distance in meters
}

/**
 * Format distance in user-friendly Indonesian format (e.g. "850 m" or "2.4 km")
 */
export function formatDistanceString(distanceInMeters: number | null | undefined): string {
  if (distanceInMeters === null || distanceInMeters === undefined || isNaN(distanceInMeters)) {
    return "-";
  }

  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }

  const km = distanceInMeters / 1000;
  return `${km.toFixed(1).replace(".", ",")} km`;
}

/**
 * Estimates motorcycle travel time in minutes based on distance
 */
export function estimateTravelTime(distanceInMeters: number | null | undefined): string {
  if (!distanceInMeters || isNaN(distanceInMeters)) return "";
  
  // Average urban speed ~ 25 km/h = ~ 416 meters per minute + 2 min buffer
  const minutes = Math.max(1, Math.round(distanceInMeters / 400 + 2));
  if (minutes < 60) {
    return `± ${minutes} menit perjalanan`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMin = minutes % 60;
  return `± ${hours} jam ${remainingMin > 0 ? `${remainingMin} mnt` : ""}`;
}
