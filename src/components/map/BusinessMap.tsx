import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Vite
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const premiumIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  isPremium?: boolean;
  address?: string;
}

interface BusinessMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMarkerClick?: (id: string) => void;
}

export function BusinessMap({
  markers,
  center = [5.3599, -4.0083], // Abidjan default
  zoom = 12,
  className = "h-[400px] w-full rounded-xl",
  onMarkerClick,
}: BusinessMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize the map
    mapRef.current = L.map(containerRef.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = L.marker([markerData.lat, markerData.lng], {
        icon: markerData.isPremium ? premiumIcon : defaultIcon,
      }).addTo(mapRef.current!);

      // Create popup content
      let popupContent = `<div class="text-sm"><p class="font-semibold">${markerData.name}</p>`;
      if (markerData.category) {
        popupContent += `<p class="text-gray-500">${markerData.category}</p>`;
      }
      if (markerData.address) {
        popupContent += `<p class="text-gray-500 text-xs mt-1">${markerData.address}</p>`;
      }
      popupContent += "</div>";

      marker.bindPopup(popupContent);

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(markerData.id));
      }

      markersRef.current.push(marker);
    });

    // Fit bounds if multiple markers
    if (markers.length > 1) {
      const bounds = L.latLngBounds(
        markers.map((m) => [m.lat, m.lng] as [number, number])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (markers.length === 1) {
      mapRef.current.setView([markers[0].lat, markers[0].lng], 15);
    }
  }, [markers, onMarkerClick]);

  return <div ref={containerRef} className={className} style={{ zIndex: 0 }} />;
}
