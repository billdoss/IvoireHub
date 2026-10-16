import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { COMMUNE_CENTERS } from "@/lib/geo";

export interface GardePharmacy {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  commune_name: string | null;
  city_name: string | null;
  latitude: number | null;
  longitude: number | null;
  start_date: string;
  end_date: string;
  source_url: string | null;
  commune_id: string | null;
  city_id: string | null;
  communes?: { name: string } | null;
  cities?: { name: string } | null;
}

export function resolveCoords(p: GardePharmacy): { lat: number; lng: number } | null {
  if (p.latitude != null && p.longitude != null) {
    return { lat: Number(p.latitude), lng: Number(p.longitude) };
  }
  const key = p.commune_name || p.communes?.name || "";
  const c = COMMUNE_CENTERS[key];
  return c ? { ...c } : null;
}

export function useGardePharmacies(dateISO: string) {
  const [data, setData] = useState<GardePharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const { data: rows } = await supabase
        .from("pharmacies_garde")
        .select("*, communes(name), cities(name)")
        .lte("start_date", dateISO)
        .gte("end_date", dateISO)
        .order("commune_name", { ascending: true })
        .order("name", { ascending: true });
      if (!cancelled) {
        setData((rows as GardePharmacy[]) ?? []);
        setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [dateISO]);

  return { data, loading };
}
