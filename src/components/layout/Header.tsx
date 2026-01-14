import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, MapPin, Phone, Building2, Newspaper, Pill, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Annuaire", href: "/annuaire", icon: Building2 },
  { label: "Pharmacies de Garde", href: "/pharmacies", icon: Pill },
  { label: "Actualités", href: "/actualites", icon: Newspaper },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:block text-xl font-bold text-foreground">
            Annuaire<span className="text-primary">CI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => navigate("/recherche")}
          >
            <Search className="h-5 w-5" />
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/connexion")}>
              <User className="h-4 w-4 mr-2" />
              Connexion
            </Button>
            <Button size="sm" onClick={() => navigate("/inscription")}>
              Inscrire mon entreprise
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-96 border-t border-border" : "max-h-0"
        )}
      >
        <nav className="container py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
          <div className="pt-4 space-y-2 border-t border-border">
            <Button variant="outline" className="w-full" onClick={() => { setIsMenuOpen(false); navigate("/connexion"); }}>
              <User className="h-4 w-4 mr-2" />
              Connexion
            </Button>
            <Button className="w-full" onClick={() => { setIsMenuOpen(false); navigate("/inscription"); }}>
              Inscrire mon entreprise
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
