import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FolderTree,
  Pill,
  Newspaper,
  Users,
  Settings,
  LogOut,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { label: "Entreprises", href: "/admin/entreprises", icon: Building2 },
  { label: "Catégories", href: "/admin/categories", icon: FolderTree },
  { label: "Pharmacies de garde", href: "/admin/pharmacies", icon: Pill },
  { label: "Articles", href: "/admin/articles", icon: Newspaper },
  { label: "Utilisateurs", href: "/admin/utilisateurs", icon: Users },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();
  const { signOut } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r border-border">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-foreground">AnnuaireCI</span>
            <span className="text-xs text-muted-foreground block">Administration</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour au site
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Site
          </Button>
        </header>

        {/* Mobile navigation */}
        <nav className="lg:hidden flex overflow-x-auto gap-1 p-2 border-b border-border bg-card">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
