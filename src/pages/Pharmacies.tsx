import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Clock, Calendar as CalendarIcon, Navigation, Pill, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const pharmaciesDeGarde = [
  {
    id: "1",
    name: "Pharmacie du Plateau",
    address: "Avenue Franchet d'Esperey, Plateau",
    city: "Abidjan",
    commune: "Plateau",
    phone: "+225 27 20 21 22 23",
    hours: "24h/24",
    distance: "1.2 km",
    coordinates: { lat: 5.3167, lng: -4.0167 },
  },
  {
    id: "2",
    name: "Pharmacie Riviera Palmeraie",
    address: "Boulevard des Martyrs, Cocody",
    city: "Abidjan",
    commune: "Cocody",
    phone: "+225 27 22 44 55 66",
    hours: "24h/24",
    distance: "3.5 km",
    coordinates: { lat: 5.3500, lng: -3.9833 },
  },
  {
    id: "3",
    name: "Pharmacie Marcory Résidentiel",
    address: "Rue Pierre et Marie Curie, Marcory",
    city: "Abidjan",
    commune: "Marcory",
    phone: "+225 27 21 26 27 28",
    hours: "24h/24",
    distance: "4.1 km",
    coordinates: { lat: 5.3000, lng: -3.9833 },
  },
  {
    id: "4",
    name: "Pharmacie Yopougon Selmer",
    address: "Carrefour Selmer, Yopougon",
    city: "Abidjan",
    commune: "Yopougon",
    phone: "+225 27 23 45 67 89",
    hours: "24h/24",
    distance: "8.2 km",
    coordinates: { lat: 5.3333, lng: -4.0833 },
  },
];

const communes = [
  "Toutes les communes",
  "Plateau",
  "Cocody",
  "Marcory",
  "Yopougon",
  "Treichville",
  "Adjamé",
  "Abobo",
  "Koumassi",
];

export default function Pharmacies() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCommune, setSelectedCommune] = useState("Toutes les communes");

  const filteredPharmacies = pharmaciesDeGarde.filter(
    (p) => selectedCommune === "Toutes les communes" || p.commune === selectedCommune
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-dark py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-success rounded-full blur-3xl" />
          </div>
          <div className="container relative">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-4 border-success/30 text-success bg-success/10">
                <Pill className="h-3 w-3 mr-1" />
                Service 24h/24
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
            <div className="flex flex-col md:flex-row gap-4">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full md:w-auto justify-start text-left font-normal h-12")}>
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
                <SelectTrigger className="w-full md:w-64 h-12">
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
            </div>
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
                <span className="font-semibold text-foreground">{filteredPharmacies.length}</span> pharmacie(s) de garde
                pour le <span className="font-semibold text-foreground">{format(date, "d MMMM yyyy", { locale: fr })}</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="bg-card rounded-2xl p-6 border border-border hover:border-success/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">{pharmacy.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{pharmacy.address}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{pharmacy.commune}, {pharmacy.city}</p>
                    </div>
                    <Badge variant="default" className="bg-success shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {pharmacy.hours}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button className="flex-1" asChild>
                      <a href={`tel:${pharmacy.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        {pharmacy.phone}
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Itinéraire
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPharmacies.length === 0 && (
              <div className="text-center py-16">
                <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-4">
                  Aucune pharmacie de garde trouvée pour cette date et cette commune.
                </p>
                <Button variant="outline" onClick={() => setSelectedCommune("Toutes les communes")}>
                  Voir toutes les communes
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
