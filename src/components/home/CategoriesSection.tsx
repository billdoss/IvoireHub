import { Link } from "react-router-dom";
import { 
  Utensils, 
  Stethoscope, 
  Car, 
  Home, 
  Scale, 
  Wrench,
  GraduationCap,
  ShoppingBag,
  Dumbbell,
  Plane,
  Briefcase,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { 
    icon: Utensils, 
    label: "Restaurants & Bars", 
    count: "2,450+",
    href: "/annuaire/restaurants",
    color: "bg-orange-100 text-orange-600"
  },
  { 
    icon: Stethoscope, 
    label: "Santé & Médecine", 
    count: "1,890+",
    href: "/annuaire/sante",
    color: "bg-red-100 text-red-600"
  },
  { 
    icon: Car, 
    label: "Auto & Moto", 
    count: "980+",
    href: "/annuaire/auto",
    color: "bg-blue-100 text-blue-600"
  },
  { 
    icon: Home, 
    label: "Immobilier", 
    count: "1,250+",
    href: "/annuaire/immobilier",
    color: "bg-green-100 text-green-600"
  },
  { 
    icon: Scale, 
    label: "Services Juridiques", 
    count: "560+",
    href: "/annuaire/juridique",
    color: "bg-purple-100 text-purple-600"
  },
  { 
    icon: Wrench, 
    label: "Artisans & BTP", 
    count: "1,670+",
    href: "/annuaire/artisans",
    color: "bg-amber-100 text-amber-600"
  },
  { 
    icon: GraduationCap, 
    label: "Éducation & Formation", 
    count: "780+",
    href: "/annuaire/education",
    color: "bg-indigo-100 text-indigo-600"
  },
  { 
    icon: ShoppingBag, 
    label: "Commerce & Shopping", 
    count: "2,100+",
    href: "/annuaire/commerce",
    color: "bg-pink-100 text-pink-600"
  },
  { 
    icon: Dumbbell, 
    label: "Sport & Loisirs", 
    count: "430+",
    href: "/annuaire/sport",
    color: "bg-teal-100 text-teal-600"
  },
  { 
    icon: Plane, 
    label: "Voyages & Tourisme", 
    count: "670+",
    href: "/annuaire/voyages",
    color: "bg-sky-100 text-sky-600"
  },
  { 
    icon: Briefcase, 
    label: "Services aux Entreprises", 
    count: "890+",
    href: "/annuaire/entreprises",
    color: "bg-slate-100 text-slate-600"
  },
  { 
    icon: Sparkles, 
    label: "Beauté & Bien-être", 
    count: "1,120+",
    href: "/annuaire/beaute",
    color: "bg-rose-100 text-rose-600"
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Explorer par catégorie
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Parcourez notre annuaire organisé en catégories pour trouver rapidement ce dont vous avez besoin.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.label}
              to={category.href}
              className="group flex flex-col items-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-foreground text-center text-sm mb-1 group-hover:text-primary transition-colors">
                {category.label}
              </h3>
              <span className="text-xs text-muted-foreground">{category.count}</span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link to="/annuaire">
              Voir toutes les catégories
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
