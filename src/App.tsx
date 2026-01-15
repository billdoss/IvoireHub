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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
