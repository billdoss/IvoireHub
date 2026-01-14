import { Link } from "react-router-dom";
import { Pill, Newspaper, Plane, Home, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const praktikServices = [
  {
    icon: Pill,
    title: "Pharmacies de Garde",
    description: "Trouvez rapidement une pharmacie ouverte près de chez vous, jour et nuit.",
    href: "/pharmacies",
    color: "bg-emerald-500",
    badge: "24/7",
  },
  {
    icon: Newspaper,
    title: "Actualités",
    description: "Restez informé des dernières nouvelles business et économiques en Côte d'Ivoire.",
    href: "/actualites",
    color: "bg-blue-500",
    badge: "Nouveau",
  },
  {
    icon: Plane,
    title: "Horaires de Vols",
    description: "Consultez les départs et arrivées des vols à l'aéroport d'Abidjan en temps réel.",
    href: "/vols",
    color: "bg-violet-500",
    badge: "Bientôt",
  },
  {
    icon: Home,
    title: "Immobilier",
    description: "Location et vente d'appartements, maisons et terrains dans tout le pays.",
    href: "/immobilier",
    color: "bg-amber-500",
    badge: "Bientôt",
  },
];

export function PraktikSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            <Clock className="h-3 w-3 mr-1" />
            Services Pratiques
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Les rubriques <span className="text-gradient">Pratik</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Des informations essentielles pour votre quotidien en Côte d'Ivoire, accessibles en un clic.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {praktikServices.map((service, index) => (
            <Link
              key={service.title}
              to={service.href}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Background Decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${service.color} opacity-5 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${service.color} bg-opacity-10`}>
                    <service.icon className={`h-6 w-6 ${service.color.replace('bg-', 'text-')}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {service.badge}
                  </Badge>
                </div>

                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>

                <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Accéder
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
