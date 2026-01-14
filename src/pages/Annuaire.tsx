import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  BadgeCheck, 
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const businesses = [
  {
    id: "1",
    name: "Restaurant Le Baobab",
    category: "Restaurant",
    subcategory: "Cuisine Africaine",
    description: "Cuisine africaine authentique et raffinée au cœur d'Abidjan. Spécialités ivoiriennes et ouest-africaines.",
    address: "Cocody, Riviera Golf",
    city: "Abidjan",
    rating: 4.8,
    reviewCount: 156,
    phone: "+225 07 00 00 00",
    isOpen: true,
    isVerified: true,
    isPremium: true,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Clinique Santé Plus",
    category: "Santé",
    subcategory: "Centre Médical",
    description: "Centre médical moderne avec des spécialistes qualifiés. Consultation, imagerie, laboratoire.",
    address: "Plateau, Avenue Marchand",
    city: "Abidjan",
    rating: 4.6,
    reviewCount: 89,
    phone: "+225 01 00 00 00",
    isOpen: true,
    isVerified: true,
    isPremium: true,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Garage Auto Excellence",
    category: "Auto",
    subcategory: "Mécanique Générale",
    description: "Réparation et entretien toutes marques. Mécaniciens experts et pièces d'origine.",
    address: "Marcory, Zone 4",
    city: "Abidjan",
    rating: 4.5,
    reviewCount: 67,
    phone: "+225 05 00 00 00",
    isOpen: false,
    isVerified: true,
    isPremium: false,
    image: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Cabinet Juridique Koné",
    category: "Juridique",
    subcategory: "Avocat d'Affaires",
    description: "Avocat d'affaires spécialisé en droit commercial et des sociétés. Conseil et contentieux.",
    address: "Plateau, Rue du Commerce",
    city: "Abidjan",
    rating: 4.9,
    reviewCount: 42,
    phone: "+225 27 00 00 00",
    isOpen: true,
    isVerified: true,
    isPremium: true,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Salon Beauté Divine",
    category: "Beauté",
    subcategory: "Coiffure & Soins",
    description: "Salon de coiffure et institut de beauté. Soins capillaires, manucure, pédicure.",
    address: "Yopougon, Maroc",
    city: "Abidjan",
    rating: 4.7,
    reviewCount: 203,
    phone: "+225 07 11 11 11",
    isOpen: true,
    isVerified: false,
    isPremium: false,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Hôtel Ivoire Palace",
    category: "Hôtellerie",
    subcategory: "Hôtel 4 étoiles",
    description: "Hôtel de luxe avec vue sur la lagune. Piscine, spa, restaurant gastronomique.",
    address: "Cocody, Ambassades",
    city: "Abidjan",
    rating: 4.4,
    reviewCount: 178,
    phone: "+225 27 22 22 22",
    isOpen: true,
    isVerified: true,
    isPremium: true,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  },
];

const cities = ["Toutes les villes", "Abidjan", "Bouaké", "Yamoussoukro", "San Pedro", "Korhogo"];
const categories = ["Toutes catégories", "Restaurant", "Santé", "Auto", "Juridique", "Beauté", "Hôtellerie"];

export default function Annuaire() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCity, setSelectedCity] = useState("Toutes les villes");
  const [selectedCategory, setSelectedCategory] = useState("Toutes catégories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "Toutes les villes" || business.city === selectedCity;
    const matchesCategory = selectedCategory === "Toutes catégories" || business.category === selectedCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Search Header */}
        <section className="bg-gradient-hero py-8 md:py-12">
          <div className="container">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-6">
              Annuaire des professionnels
            </h1>
            
            <div className="bg-card rounded-xl p-3 shadow-lg">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 border-0 bg-muted/50"
                  />
                </div>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-12 w-full md:w-48 border-0 bg-muted/50">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 w-full md:w-48 border-0 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="h-12 px-6">
                  <Search className="h-5 w-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredBusinesses.length}</span> résultats trouvés
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCity !== "Toutes les villes" || selectedCategory !== "Toutes catégories") && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    {searchQuery}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
                {selectedCity !== "Toutes les villes" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCity}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCity("Toutes les villes")} />
                  </Badge>
                )}
                {selectedCategory !== "Toutes catégories" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("Toutes catégories")} />
                  </Badge>
                )}
              </div>
            )}

            {/* Results Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <Link
                    key={business.id}
                    to={`/entreprise/${business.id}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {business.isPremium && (
                        <Badge className="absolute top-3 left-3 bg-gradient-hero border-0">Premium</Badge>
                      )}
                      <Badge 
                        variant={business.isOpen ? "default" : "secondary"} 
                        className={`absolute top-3 right-3 ${business.isOpen ? "bg-success" : ""}`}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {business.isOpen ? "Ouvert" : "Fermé"}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {business.name}
                            </h3>
                            {business.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{business.subcategory}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold">{business.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{business.description}</p>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{business.address}, {business.city}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBusinesses.map((business) => (
                  <Link
                    key={business.id}
                    to={`/entreprise/${business.id}`}
                    className="group flex gap-4 bg-card rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-40 h-28 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {business.name}
                            </h3>
                            {business.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                            {business.isPremium && <Badge className="bg-gradient-hero border-0 text-xs">Premium</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{business.subcategory}</p>
                        </div>
                        <Badge variant={business.isOpen ? "default" : "secondary"} className={business.isOpen ? "bg-success" : ""}>
                          {business.isOpen ? "Ouvert" : "Fermé"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{business.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold text-foreground">{business.rating}</span>
                          <span>({business.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{business.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{business.phone}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">Aucun résultat trouvé pour votre recherche.</p>
                <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCity("Toutes les villes"); setSelectedCategory("Toutes catégories"); }}>
                  Réinitialiser les filtres
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
