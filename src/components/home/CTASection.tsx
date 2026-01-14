import { Link } from "react-router-dom";
import { Building2, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Visibilité auprès de milliers de clients potentiels",
  "Fiche entreprise complète et personnalisable",
  "Avis clients et notes pour renforcer la confiance",
  "Statistiques de performance de votre fiche",
];

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Rejoignez plus de 10 000 entreprises</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary-foreground mb-6">
              Développez votre visibilité avec <span className="text-primary">AnnuaireCI</span>
            </h2>

            <p className="text-lg text-secondary-foreground/80 mb-8">
              Inscrivez votre entreprise gratuitement et commencez à attirer de nouveaux clients dès aujourd'hui. Nos offres premium vous donnent encore plus de visibilité.
            </p>

            <ul className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-secondary-foreground/90">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="xl" variant="hero" asChild>
                <Link to="/inscription">
                  <Building2 className="h-5 w-5 mr-2" />
                  Inscrire mon entreprise
                </Link>
              </Button>
              <Button size="xl" variant="heroOutline" asChild>
                <Link to="/premium">
                  Découvrir les offres Premium
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-secondary-foreground/20">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <p className="text-secondary-foreground/80">Entreprises inscrites</p>
            </div>
            <div className="bg-secondary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-secondary-foreground/20">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
              <p className="text-secondary-foreground/80">Visiteurs mensuels</p>
            </div>
            <div className="bg-secondary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-secondary-foreground/20">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">25+</div>
              <p className="text-secondary-foreground/80">Villes couvertes</p>
            </div>
            <div className="bg-secondary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-secondary-foreground/20">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4.8</div>
              <p className="text-secondary-foreground/80">Note moyenne</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
