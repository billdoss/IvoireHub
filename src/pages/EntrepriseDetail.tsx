import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  BadgeCheck,
  Globe,
  Mail,
  Facebook,
  Instagram,
  MessageCircle,
  Navigation,
  Share2,
  Heart,
  ChevronLeft,
  Calendar,
} from "lucide-react";

// Mock data - in production this would come from API
const businessData = {
  id: "1",
  name: "Restaurant Le Baobab",
  category: "Restaurant",
  subcategory: "Cuisine Africaine",
  description: "Restaurant Le Baobab vous accueille dans un cadre chaleureux et authentique pour une expérience culinaire inoubliable. Notre chef prépare avec passion des plats traditionnels ivoiriens et ouest-africains, en utilisant des ingrédients frais et locaux. Que ce soit pour un déjeuner d'affaires, un dîner en famille ou une célébration, nous sommes là pour vous servir les meilleures saveurs de l'Afrique.",
  shortDescription: "Cuisine africaine authentique et raffinée au cœur d'Abidjan. Spécialités ivoiriennes et ouest-africaines.",
  address: "Boulevard Latrille, Cocody Riviera Golf",
  city: "Abidjan",
  commune: "Cocody",
  landmark: "À côté de la station Shell",
  coordinates: { lat: 5.3364, lng: -4.0267 },
  rating: 4.8,
  reviewCount: 156,
  phone: "+225 07 00 00 00",
  phone2: "+225 01 00 00 00",
  email: "contact@lebaobab.ci",
  website: "https://www.lebaobab.ci",
  whatsapp: "+225 07 00 00 00",
  facebook: "https://facebook.com/lebaobab",
  instagram: "https://instagram.com/lebaobab",
  isOpen: true,
  isVerified: true,
  isPremium: true,
  hours: [
    { day: "Lundi", hours: "11:00 - 23:00", isOpen: true },
    { day: "Mardi", hours: "11:00 - 23:00", isOpen: true },
    { day: "Mercredi", hours: "11:00 - 23:00", isOpen: true },
    { day: "Jeudi", hours: "11:00 - 23:00", isOpen: true },
    { day: "Vendredi", hours: "11:00 - 00:00", isOpen: true },
    { day: "Samedi", hours: "11:00 - 00:00", isOpen: true },
    { day: "Dimanche", hours: "12:00 - 22:00", isOpen: true },
  ],
  services: ["Wifi gratuit", "Parking", "Terrasse", "Climatisation", "Réservation", "Livraison", "Plats à emporter"],
  images: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
  ],
  reviews: [
    { id: 1, author: "Awa M.", rating: 5, date: "Il y a 2 jours", comment: "Excellent restaurant ! L'attiéké poisson était délicieux. Service impeccable et cadre très agréable." },
    { id: 2, author: "Jean-Pierre K.", rating: 4, date: "Il y a 1 semaine", comment: "Bonne cuisine, portions généreuses. Un peu d'attente en heure de pointe mais ça vaut le coup." },
    { id: 3, author: "Marie D.", rating: 5, date: "Il y a 2 semaines", comment: "Notre restaurant préféré pour les réunions de famille. Le poulet braisé est incroyable !" },
  ],
};

export default function EntrepriseDetail() {
  const { id } = useParams();
  const business = businessData; // In production, fetch by id

  const currentDay = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const todayHours = business.hours.find((h) => h.day.toLowerCase() === currentDay.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Accueil</Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/annuaire" className="text-muted-foreground hover:text-foreground transition-colors">Annuaire</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{business.name}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <section className="bg-muted/30">
          <div className="container py-4">
            <div className="grid grid-cols-4 gap-2 md:gap-4 rounded-2xl overflow-hidden">
              <div className="col-span-4 md:col-span-2 row-span-2">
                <img
                  src={business.images[0]}
                  alt={business.name}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              {business.images.slice(1).map((img, index) => (
                <div key={index} className="hidden md:block">
                  <img
                    src={img}
                    alt={`${business.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {business.isPremium && (
                      <Badge className="bg-gradient-hero border-0">Premium</Badge>
                    )}
                    <Badge variant="secondary">{business.category}</Badge>
                    <Badge variant="outline">{business.subcategory}</Badge>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 mb-2">
                        {business.name}
                        {business.isVerified && <BadgeCheck className="h-6 w-6 text-primary" />}
                      </h1>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-lg">{business.rating}</span>
                          <span className="text-muted-foreground">({business.reviewCount} avis)</span>
                        </div>
                        <Badge variant={business.isOpen ? "default" : "secondary"} className={business.isOpen ? "bg-success" : ""}>
                          <Clock className="h-3 w-3 mr-1" />
                          {business.isOpen ? "Ouvert maintenant" : "Fermé"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">À propos</h2>
                  <p className="text-muted-foreground leading-relaxed">{business.description}</p>
                </div>

                {/* Services */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Services</h2>
                  <div className="flex flex-wrap gap-2">
                    {business.services.map((service) => (
                      <Badge key={service} variant="secondary" className="px-3 py-1">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Avis clients</h2>
                    <Button variant="outline" size="sm">Écrire un avis</Button>
                  </div>
                  <div className="space-y-4">
                    {business.reviews.map((review) => (
                      <div key={review.id} className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {review.author.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{review.author}</p>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Card */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm sticky top-24">
                  <h3 className="font-semibold text-foreground mb-4">Contact</h3>
                  
                  <div className="space-y-4 mb-6">
                    <a href={`tel:${business.phone}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{business.phone}</p>
                        {business.phone2 && <p className="text-sm text-muted-foreground">{business.phone2}</p>}
                      </div>
                    </a>

                    <a href={`mailto:${business.email}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{business.email}</span>
                    </a>

                    {business.website && (
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">Site web</span>
                      </a>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" size="lg">
                      <Phone className="h-5 w-5 mr-2" />
                      Appeler
                    </Button>
                    <Button variant="success" className="w-full bg-success hover:bg-success/90" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </Button>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-border">
                    {business.facebook && (
                      <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {business.instagram && (
                      <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Hours Card */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Horaires d'ouverture
                  </h3>
                  <div className="space-y-2">
                    {business.hours.map((schedule) => (
                      <div key={schedule.day} className={`flex justify-between text-sm py-1 ${schedule.day.toLowerCase() === currentDay.toLowerCase() ? "font-semibold text-primary" : ""}`}>
                        <span className={schedule.isOpen ? "text-foreground" : "text-muted-foreground"}>{schedule.day}</span>
                        <span className={schedule.isOpen ? "text-foreground" : "text-muted-foreground"}>{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Adresse
                  </h3>
                  <p className="text-foreground mb-1">{business.address}</p>
                  <p className="text-muted-foreground text-sm mb-1">{business.commune}, {business.city}</p>
                  {business.landmark && (
                    <p className="text-muted-foreground text-sm italic">{business.landmark}</p>
                  )}
                  <Button variant="outline" className="w-full mt-4">
                    <Navigation className="h-4 w-4 mr-2" />
                    Itinéraire
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
