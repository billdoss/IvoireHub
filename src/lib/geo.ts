/** Distance haversine en km entre deux points GPS. */
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function formatDistance(km: number | null | undefined): string {
  if (km == null || !isFinite(km)) return "—";
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

/** Centre approximatif de chaque commune d'Abidjan (repli quand GPS absent). */
export const COMMUNE_CENTERS: Record<string, { lat: number; lng: number }> = {
  "Abobo": { lat: 5.4167, lng: -4.0167 },
  "Adjamé": { lat: 5.35, lng: -4.0333 },
  "Attécoubé": { lat: 5.35, lng: -4.05 },
  "Cocody": { lat: 5.35, lng: -3.9833 },
  "Koumassi": { lat: 5.3, lng: -3.95 },
  "Marcory": { lat: 5.3, lng: -3.9833 },
  "Plateau": { lat: 5.3167, lng: -4.0167 },
  "Port-Bouët": { lat: 5.25, lng: -3.95 },
  "Treichville": { lat: 5.2833, lng: -4.0 },
  "Yopougon": { lat: 5.3333, lng: -4.0833 },
  "Anyama": { lat: 5.5, lng: -4.05 },
  "Bingerville": { lat: 5.35, lng: -3.8833 },
  "Songon": { lat: 5.3167, lng: -4.1167 },
};
