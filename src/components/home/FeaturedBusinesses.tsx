import { Link } from "react-router-dom";
import { MapPin, Star, Phone, Clock, BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featuredBusinesses = [
  {
    id: "1",
    name: "Restaurant Le Baobab",
    category: "Restaurant",
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
];

export function FeaturedBusinesses() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              <Star className="h-3 w-3 mr-1 fill-primary" />
              Sélection du mois
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Entreprises à la une
            </h2>
            <p className="text-muted-foreground text-lg">
              Découvrez les professionnels les mieux notés de notre communauté.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/annuaire?featured=true">
              Voir tout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBusinesses.map((business, index) => (
            <Link
              key={business.id}
              to={`/entreprise/${business.id}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {business.isPremium && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-hero text-primary-foreground border-0">
                      Premium
                    </Badge>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant={business.isOpen ? "default" : "secondary"} className={business.isOpen ? "bg-success" : ""}>
                    <Clock className="h-3 w-3 mr-1" />
                    {business.isOpen ? "Ouvert" : "Fermé"}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {business.name}
                      </h3>
                      {business.isVerified && (
                        <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{business.category}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-foreground">{business.rating}</span>
                    <span className="text-xs text-muted-foreground">({business.reviewCount})</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {business.description}
                </p>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{business.address}, {business.city}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
