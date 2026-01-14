import { Link } from "react-router-dom";
import { Calendar, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const latestNews = [
  {
    id: "1",
    title: "Les nouvelles tendances du e-commerce en Côte d'Ivoire",
    excerpt: "Le marché du commerce en ligne connaît une croissance exceptionnelle avec l'essor du mobile money...",
    category: "Business",
    author: "Marie K.",
    date: "12 Jan 2026",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    featured: true,
  },
  {
    id: "2",
    title: "Guide : Créer son entreprise à Abidjan en 2026",
    excerpt: "Toutes les étapes administratives pour lancer votre activité dans la capitale économique...",
    category: "Entrepreneuriat",
    author: "Jean-Paul A.",
    date: "10 Jan 2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    featured: false,
  },
  {
    id: "3",
    title: "Top 10 des restaurants africains à découvrir",
    excerpt: "Notre sélection des meilleures adresses pour déguster la cuisine du continent...",
    category: "Gastronomie",
    author: "Awa D.",
    date: "8 Jan 2026",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    featured: false,
  },
];

export function NewsSection() {
  const [featuredArticle, ...otherArticles] = latestNews;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              Actualités
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Les dernières actualités
            </h2>
            <p className="text-muted-foreground text-lg">
              Restez informé des actualités économiques et business en Côte d'Ivoire.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/actualites">
              Toutes les actualités
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Article */}
          <Link
            to={`/actualites/${featuredArticle.id}`}
            className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <Badge variant="secondary" className="mb-3">
                {featuredArticle.category}
              </Badge>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {featuredArticle.title}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
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
              </div>
            </div>
          </Link>

          {/* Other Articles */}
          <div className="space-y-4">
            {otherArticles.map((article) => (
              <Link
                key={article.id}
                to={`/actualites/${article.id}`}
                className="group flex gap-4 bg-card rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {article.category}
                  </Badge>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
