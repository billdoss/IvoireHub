import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";

const articles = [
  {
    id: "1",
    title: "Les nouvelles tendances du e-commerce en Côte d'Ivoire",
    excerpt: "Le marché du commerce en ligne connaît une croissance exceptionnelle avec l'essor du mobile money et l'augmentation de la pénétration internet. Découvrez les chiffres clés et les opportunités pour les entrepreneurs.",
    category: "Business",
    author: "Marie Kouassi",
    date: "12 Jan 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
    featured: true,
  },
  {
    id: "2",
    title: "Guide complet : Créer son entreprise à Abidjan en 2026",
    excerpt: "Toutes les étapes administratives pour lancer votre activité dans la capitale économique ivoirienne. Du guichet unique aux démarches fiscales.",
    category: "Entrepreneuriat",
    author: "Jean-Paul Aka",
    date: "10 Jan 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    id: "3",
    title: "Top 10 des restaurants africains à découvrir absolument",
    excerpt: "Notre sélection des meilleures adresses pour déguster la cuisine du continent africain à Abidjan. Des saveurs authentiques qui vous feront voyager.",
    category: "Gastronomie",
    author: "Awa Diallo",
    date: "8 Jan 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    id: "4",
    title: "L'immobilier à Abidjan : État des lieux et perspectives",
    excerpt: "Analyse complète du marché immobilier abidjanais. Prix au m², quartiers en vogue, et conseils pour investir intelligemment.",
    category: "Immobilier",
    author: "Olivier Bamba",
    date: "5 Jan 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    id: "5",
    title: "Santé : Les cliniques les mieux équipées de Côte d'Ivoire",
    excerpt: "Focus sur les établissements de santé qui font la différence avec des équipements de pointe et un personnel qualifié.",
    category: "Santé",
    author: "Dr. Fatou Koné",
    date: "3 Jan 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    id: "6",
    title: "Le digital au service des PME ivoiriennes",
    excerpt: "Comment les petites et moyennes entreprises peuvent tirer profit des outils numériques pour accélérer leur croissance.",
    category: "Tech",
    author: "Konan Yao",
    date: "1 Jan 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    featured: false,
  },
];

const categories = ["Tous", "Business", "Entrepreneuriat", "Gastronomie", "Immobilier", "Santé", "Tech"];

export default function Actualites() {
  const featuredArticle = articles.find((a) => a.featured);
  const otherArticles = articles.filter((a) => !a.featured);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Actualités
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl">
              Restez informé des dernières nouvelles business, économiques et pratiques en Côte d'Ivoire.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 bg-card border-b border-border">
          <div className="container">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={cat === "Tous" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 md:py-12">
          <div className="container">
            {/* Featured Article */}
            {featuredArticle && (
              <Link
                to={`/actualites/${featuredArticle.id}`}
                className="group grid md:grid-cols-2 gap-6 bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 mb-12"
              >
                <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-4">
                    {featuredArticle.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {featuredArticle.author}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {featuredArticle.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {featuredArticle.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/actualites/${article.id}`}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <Badge variant="secondary" className="mb-3">
                      {article.category}
                    </Badge>
                    <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
