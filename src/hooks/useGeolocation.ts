import { useCallback, useState } from "react";

export interface GeoPosition {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Géolocalisation non supportée par ce navigateur.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setError("Position refusée. Autorisez l'accès à votre position.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, []);

  return { position, loading, error, locate, setPosition };
}
