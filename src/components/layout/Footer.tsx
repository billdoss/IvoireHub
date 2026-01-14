import { Link } from "react-router-dom";
import { MapPin, Facebook, Instagram, Linkedin, Twitter, Phone, Mail } from "lucide-react";

const footerLinks = {
  annuaire: [
    { label: "Toutes les catégories", href: "/annuaire" },
    { label: "Abidjan", href: "/annuaire/abidjan" },
    { label: "Bouaké", href: "/annuaire/bouake" },
    { label: "Yamoussoukro", href: "/annuaire/yamoussoukro" },
  ],
  services: [
    { label: "Pharmacies de Garde", href: "/pharmacies" },
    { label: "Actualités", href: "/actualites" },
    { label: "Horaires de Vols", href: "/vols" },
    { label: "Immobilier", href: "/immobilier" },
  ],
  entreprise: [
    { label: "Inscrire mon entreprise", href: "/inscription" },
    { label: "Offres Premium", href: "/premium" },
    { label: "Publicité", href: "/publicite" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "CGU", href: "/cgu" },
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-secondary-foreground">
                Annuaire<span className="text-primary">CI</span>
              </span>
            </Link>
            <p className="text-sm text-secondary-foreground/70 mb-4">
              L'annuaire de référence des professionnels et entreprises en Côte d'Ivoire.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">Annuaire</h4>
            <ul className="space-y-2">
              {footerLinks.annuaire.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">Entreprises</h4>
            <ul className="space-y-2">
              {footerLinks.entreprise.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-secondary-foreground mb-4">Informations</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2">
              <a
                href="tel:+22500000000"
                className="flex items-center gap-2 text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                +225 00 00 00 00
              </a>
              <a
                href="mailto:contact@annuaireci.com"
                className="flex items-center gap-2 text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                contact@annuaireci.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/10">
          <p className="text-center text-sm text-secondary-foreground/60">
            © {new Date().getFullYear()} AnnuaireCI. Tous droits réservés. Fait avec ❤️ en Côte d'Ivoire.
          </p>
        </div>
      </div>
    </footer>
  );
}
