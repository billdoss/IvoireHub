import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEntreprises from "./pages/admin/AdminEntreprises";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPharmacies from "./pages/admin/AdminPharmacies";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminUtilisateurs from "./pages/admin/AdminUtilisateurs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
