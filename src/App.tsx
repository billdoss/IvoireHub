import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Annuaire from "./pages/Annuaire";
import EntrepriseDetail from "./pages/EntrepriseDetail";
import Pharmacies from "./pages/Pharmacies";
import Actualites from "./pages/Actualites";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Dashboard from "./pages/Dashboard";
import NouvelleEntreprise from "./pages/NouvelleEntreprise";
import EditerEntreprise from "./pages/EditerEntreprise";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEntreprises from "./pages/admin/AdminEntreprises";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPharmacies from "./pages/admin/AdminPharmacies";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminUtilisateurs from "./pages/admin/AdminUtilisateurs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const navigate = useNavigate();

  // Restaure la route après un redirect 404.html -> index.html (SPA sur GitHub Pages)
  useEffect(() => {
    const redirectPath = sessionStorage.getItem("spa-redirect-path");
    if (redirectPath && redirectPath !== "/IvoireHub/" && redirectPath !== "/IvoireHub/index.html") {
      sessionStorage.removeItem("spa-redirect-path");
      const base = "/IvoireHub/";
      let relativePath = redirectPath;
      if (relativePath.startsWith(base)) {
        relativePath = relativePath.slice(base.length);
      }
      if (!relativePath.startsWith("/")) {
        relativePath = "/" + relativePath;
      }
      navigate(relativePath, { replace: true });
    }
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* BASE_URL = "/IvoireHub/" (defini dans vite.config.ts) : indispensable
          pour que les routes fonctionnent depuis le sous-chemin de deploiement. */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <ErrorBoundary
            fallback={(error, reset) => (
              <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
                <h1 className="text-2xl font-bold text-destructive mb-4">Erreur d'application</h1>
                <pre className="text-sm text-muted-foreground mb-4 max-w-md whitespace-pre-wrap break-all">{error.message}</pre>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Réessayer
                </button>
              </div>
            )}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/annuaire" element={<Annuaire />} />
              <Route path="/annuaire/:category" element={<Annuaire />} />
              <Route path="/entreprise/:id" element={<EntrepriseDetail />} />
              <Route path="/pharmacies" element={<Pharmacies />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/actualites/:id" element={<Actualites />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/nouvelle-entreprise" element={<NouvelleEntreprise />} />
              <Route path="/dashboard/editer/:id" element={<EditerEntreprise />} />
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/entreprises" element={<AdminEntreprises />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/pharmacies" element={<AdminPharmacies />} />
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
