import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessMap } from "@/components/map/BusinessMap";
import {
  MapPin, Phone, Clock, Calendar as CalendarIcon, Navigation, Pill,
  AlertCircle, LocateFixed, Search, Loader2, ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { haversineKm, formatDistance } from "@/lib/geo";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useGardePharmacies, resolveCoords } from "@/hooks/useGardePharmacies";

const ALL = "Toutes les communes";

export default function Pharmacies() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCommune, setSelectedCommune] = useState(ALL);
  const [query, setQuery] = useState("");
  const [sortNearest, setSortNearest] = useState(false);
  const { position, loading: geoLoading, error: geoError, locate } = useGeolocation();

  const dateISO = format(date, "yyyy-MM-dd");
  const { data: pharmacies, loading, error } = useGardePharmacies(dateISO);

  const communes = useMemo(() => {
    const set = new Set<string>();
    pharmacies.forEach((p) => {
      const c = p.commune_name || p.communes?.name;
      if (c) set.add(c);
    });
    return [ALL, ...[...set].sort((a, b) => a.localeCompare(b, "fr"))];
  }, [pharmacies]);

  const enriched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pharmacies
      .filter((p) => {
        const commune = p.commune_name || p.communes?.name || "";
        if (selectedCommune !== ALL && commune !== selectedCommune) return false;
        if (q && !`${p.name} ${p.address ?? ""} ${commune}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .map((p) => {
        const coords = resolveCoords(p);
        const dist = position && coords
          ? haversineKm(position.lat, position.lng, coords.lat, coords.lng) : null;
        return { ...p, commune: p.commune_name || p.communes?.name || "—", coords, dist };
      })
      .sort((a, b) => {
        if (sortNearest && position) return (a.dist ?? Infinity) - (b.dist ?? Infinity);
        return a.name.localeCompare(b.name, "fr");
      });
  }, [pharmacies, selectedCommune, query, position, sortNearest]);

  const nearest = sortNearest && position ? enriched[0] : null;

  const markers = useMemo(
    () => enriched.filter((p) => p.coords).map((p) => ({
      id: p.id, name: p.name, lat: p.coords!.lat, lng: p.coords!.lng,
      address: p.address || undefined,
      category: p.dist != null ? formatDistance(p.dist) : p.commune,
    })),
    [enriched]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {error ? (
          <section className="bg-background py-16 text-center">
            <div className="max-w-md mx-auto px-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">
                Configuration manquante
              </h2>
              <p className="text-muted-foreground mb-6">
                Les variables d&apos;environnement Supabase ne sont pas configur&eacute;es.
                Veuillez configurer VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY.
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* Hero */}
        <section className="bg-gradient-dark py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-success rounded-full blur-3xl" />
          </div>
          <div className="container relative">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-4 border-success/30 text-success bg-success/10">
                <Pill className="h-3 w-3 mr-1" />
                Service 24h/24 — actualisé quotidiennement
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
                Pharmacies de Garde
              </h1>
              <p className="text-lg text-secondary-foreground/80">
                Trouvez rapidement une pharmacie ouverte près de chez vous, de jour comme de nuit. Service disponible 24h/24, 7j/7.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-card border-b border-border">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full lg:w-auto justify-start text-left font-normal h-12">
                    <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                    {format(date, "EEEE d MMMM yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              {/* Commune Filter */}
              <Select value={selectedCommune} onValueChange={setSelectedCommune}>
                <SelectTrigger className="w-full lg:w-64 h-12">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {communes.map((commune) => (
                    <SelectItem key={commune} value={commune}>
                      {commune}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher une pharmacie, une adresse…"
                  className="h-12 pl-9"
                />
              </div>

              <Button
                variant={sortNearest ? "default" : "outline"}
                className="h-12"
                onClick={() => {
                  if (!position) locate();
                  setSortNearest((v) => !v);
                }}
                disabled={geoLoading}
              >
                {geoLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LocateFixed className="h-4 w-4 mr-2" />}
                {position ? (sortNearest ? "Plus proches ✓" : "Trier par proximité") : "Pharmacie la plus proche"}
              </Button>
            </div>
            {geoError && <p className="text-sm text-destructive mt-2">{geoError}</p>}
            {nearest && (
              <div className="mt-3 rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-sm flex items-center gap-2">
                <Navigation className="h-4 w-4 text-success shrink-0" />
                <span>
                  La plus proche : <strong>{nearest.name}</strong> ({nearest.commune}) — à {formatDistance(nearest.dist)}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Alert Banner */}
        <section className="bg-success/10 border-b border-success/20">
          <div className="container py-4">
            <div className="flex items-center gap-3 text-success">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">
                <span className="font-semibold">Rappel :</span> En cas d'urgence médicale, appelez le 185 (SAMU) ou rendez-vous aux urgences les plus proches.
              </p>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{enriched.length}</span> pharmacie(s) de garde
                pour le <span className="font-semibold text-foreground">{format(date, "d MMMM yyyy", { locale: fr })}</span>
              </p>
            </div>

            {markers.length > 0 && (
              <div className="mb-6">
                <BusinessMap markers={markers} className="h-[320px] w-full rounded-2xl border border-border" />
              </div>
            )}

            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {enriched.map((pharmacy) => (
                  <div
                    key={pharmacy.id}
                    className="bg-card rounded-2xl p-6 border border-border hover:border-success/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-1">{pharmacy.name}</h3>
                      {pharmacy.address && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{pharmacy.address}</span>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {pharmacy.commune}{pharmacy.city_name ? `, ${pharmacy.city_name}` : ""}
                      </p>
                      {pharmacy.dist != null && (
                        <p className="text-sm font-medium text-primary mt-1">
                          à {formatDistance(pharmacy.dist)}
                        </p>
                      )}
                    </div>
                    <Badge variant="default" className="bg-success shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      24h/24
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {pharmacy.phone ? (
                      <Button className="flex-1" asChild>
                        <a href={`tel:${pharmacy.phone.replace(/[^+\d]/g, "")}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {pharmacy.phone}
                        </a>
                      </Button>
                    ) : (
                      <Button className="flex-1" variant="secondary" disabled>
                        <Phone className="h-4 w-4 mr-2" />
                        Tél. non renseigné
                      </Button>
                    )}
                    {pharmacy.coords && (
                      <Button variant="outline" asChild>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coords.lat},${pharmacy.coords.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Itinéraire
                        </a>
                      </Button>
                    )}
                    {pharmacy.source_url && (
                      <Button variant="ghost" size="icon" asChild title="Voir la source">
                        <a href={pharmacy.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}

            {!loading && enriched.length === 0 && (
              <div className="text-center py-16">
                <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-4">
                  Aucune pharmacie de garde trouvée pour cette date et cette commune.
                </p>
                <Button variant="outline" onClick={() => { setSelectedCommune(ALL); setQuery(""); }}>
                  Voir toutes les communes
                </Button>
              </div>
            )}
          </div>
        </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
