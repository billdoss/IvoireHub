import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Building2, Eye, Edit, Trash2, AlertCircle, CheckCircle, Clock, XCircle, LayoutDashboard } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Business = Database["public"]["Tables"]["businesses"]["Row"];

const statusConfig = {
  draft: { label: "Brouillon", icon: Edit, variant: "secondary" as const },
  pending: { label: "En attente", icon: Clock, variant: "outline" as const },
  approved: { label: "Approuvé", icon: CheckCircle, variant: "default" as const },
  rejected: { label: "Rejeté", icon: XCircle, variant: "destructive" as const },
  suspended: { label: "Suspendu", icon: AlertCircle, variant: "destructive" as const },
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/connexion");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBusinesses();
    }
  }, [user]);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos entreprises.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?")) return;

    try {
      const { error } = await supabase.from("businesses").delete().eq("id", id);
      if (error) throw error;
      
      setBusinesses(businesses.filter((b) => b.id !== id));
      toast({
        title: "Entreprise supprimée",
        description: "L'entreprise a été supprimée avec succès.",
      });
    } catch (error) {
      console.error("Error deleting business:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entreprise.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <LayoutDashboard className="h-6 w-6" />
                Tableau de bord
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos fiches entreprises
              </p>
            </div>
            <Button onClick={() => navigate("/dashboard/nouvelle-entreprise")}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une entreprise
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{businesses.length}</p>
                    <p className="text-sm text-muted-foreground">Entreprises</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {businesses.filter((b) => b.status === "approved").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Approuvées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {businesses.filter((b) => b.status === "pending").length}
                    </p>
                    <p className="text-sm text-muted-foreground">En attente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <Eye className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {businesses.reduce((sum, b) => sum + (b.views_count || 0), 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Vues totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Businesses List */}
          <Card>
            <CardHeader>
              <CardTitle>Mes entreprises</CardTitle>
              <CardDescription>
                Liste de toutes vos fiches entreprises
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Aucune entreprise
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par ajouter votre première entreprise
                  </p>
                  <Button onClick={() => navigate("/dashboard/nouvelle-entreprise")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une entreprise
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {businesses.map((business) => {
                    const status = statusConfig[business.status || "pending"];
                    const StatusIcon = status.icon;
                    
                    return (
                      <div
                        key={business.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            {business.logo_url ? (
                              <img
                                src={business.logo_url}
                                alt={business.name}
                                className="h-full w-full object-cover rounded-lg"
                              />
                            ) : (
                              <Building2 className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">
                              {business.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {business.description_short || "Aucune description"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={status.variant} className="flex items-center gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/entreprise/${business.slug}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/dashboard/entreprise/${business.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(business.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
