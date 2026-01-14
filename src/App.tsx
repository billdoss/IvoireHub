import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Annuaire from "./pages/Annuaire";
import EntrepriseDetail from "./pages/EntrepriseDetail";
import Pharmacies from "./pages/Pharmacies";
import Actualites from "./pages/Actualites";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/annuaire" element={<Annuaire />} />
          <Route path="/annuaire/:category" element={<Annuaire />} />
          <Route path="/entreprise/:id" element={<EntrepriseDetail />} />
          <Route path="/pharmacies" element={<Pharmacies />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/actualites/:id" element={<Actualites />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
