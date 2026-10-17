import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      if (!isSupabaseConfigured) {
        setError(
          "Configuration Supabase manquante. Veuillez configurer VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans les secrets GitHub Actions."
        );
        setLoading(false);
        return;
      }
      try {
        const { data: rows, error: supabaseError } = await supabase
          .from("pharmacies_garde")
          .select("*, communes(name), cities(name)")
          .lte("start_date", dateISO)
          .gte("end_date", dateISO)
          .order("commune_name", { ascending: true })
          .order("name", { ascending: true });
        if (supabaseError) {
          setError(supabaseError.message);
          setLoading(false);
          return;
        }
        if (!cancelled) {
          setData((rows as GardePharmacy[]) ?? []);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Erreur lors du chargement des pharmacies de garde.");
          setLoading(false);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [dateISO]);

  return { data, loading, error };
}
