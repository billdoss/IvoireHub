import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const popularSearches = [
  "Restaurant",
  "Plombier",
  "Clinique",
  "Électricien",
  "Hôtel",
  "Avocat",
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("lieu", location);
    navigate(`/annuaire?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6 animate-fade-in">
            <MapPin className="h-4 w-4" />
            <span>L'annuaire N°1 en Côte d'Ivoire</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-primary-foreground mb-6 leading-tight animate-slide-up">
            Trouvez les meilleurs professionnels près de chez vous
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Restaurants, cliniques, plombiers, avocats... Recherchez parmi des milliers d'entreprises vérifiées partout en Côte d'Ivoire.
          </p>

          {/* Search Form */}
          <form 
            onSubmit={handleSearch}
            className="bg-card rounded-2xl p-3 shadow-xl max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Que recherchez-vous ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base border-0 bg-muted/50 focus-visible:ring-primary"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ville, quartier..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-12 h-12 text-base border-0 bg-muted/50 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                Rechercher
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <span className="text-sm text-primary-foreground/60">Populaires :</span>
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => {
                  setSearchQuery(search);
                  navigate(`/annuaire?q=${search}`);
                }}
                className="px-3 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-sm text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
