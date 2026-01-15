import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Business = Database["public"]["Tables"]["businesses"]["Row"] & {
  categories?: { name: string } | null;
  cities?: { name: string } | null;
};

type BusinessStatus = Database["public"]["Enums"]["business_status"];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Brouillon", variant: "secondary" },
  pending: { label: "En attente", variant: "outline" },
  approved: { label: "Approuvé", variant: "default" },
  rejected: { label: "Rejeté", variant: "destructive" },
  suspended: { label: "Suspendu", variant: "destructive" },
};

const AdminEntreprises = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, [statusFilter]);

  const fetchBusinesses = async () => {
    try {
      let query = supabase
        .from("businesses")
        .select(`*, categories(name), cities(name)`)
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les entreprises.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessStatus = async (id: string, status: "approved" | "rejected" | "suspended" | "pending" | "draft") => {
    try {
      const { error } = await supabase
        .from("businesses")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setBusinesses(businesses.map((b) => (b.id === id ? { ...b, status } : b)));
      toast({
        title: "Statut mis à jour",
        description: `L'entreprise a été ${status === "approved" ? "approuvée" : status === "rejected" ? "rejetée" : "mise à jour"}.`,
      });
    } catch (error) {
      console.error("Error updating business:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    }
  };

  const deleteBusiness = async () => {
    if (!selectedBusiness) return;

    try {
      const { error } = await supabase
        .from("businesses")
        .delete()
        .eq("id", selectedBusiness.id);

      if (error) throw error;

      setBusinesses(businesses.filter((b) => b.id !== selectedBusiness.id));
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
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBusiness(null);
    }
  };

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      title="Gestion des entreprises"
      description="Validez et modérez les fiches entreprises"
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une entreprise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setSearchParams(value === "all" ? {} : { status: value });
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
                <SelectItem value="suspended">Suspendues</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Businesses List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Entreprises ({filteredBusinesses.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune entreprise trouvée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBusinesses.map((business) => {
                const status = statusConfig[business.status || "pending"];
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
                        <h3 className="font-medium text-foreground">{business.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{business.categories?.name || "Sans catégorie"}</span>
                          {business.cities?.name && (
                            <>
                              <span>•</span>
                              <span>{business.cities.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{business.views_count || 0}</span>
                      </div>

                      <Badge variant={status.variant}>{status.label}</Badge>

                      {business.status === "pending" && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                            onClick={() => updateBusinessStatus(business.id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => updateBusinessStatus(business.id, "rejected")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(`/entreprise/${business.slug}`, "_blank")}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Voir la fiche
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {business.status !== "approved" && (
                            <DropdownMenuItem onClick={() => updateBusinessStatus(business.id, "approved")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
                            </DropdownMenuItem>
                          )}
                          {business.status !== "suspended" && business.status === "approved" && (
                            <DropdownMenuItem onClick={() => updateBusinessStatus(business.id, "suspended")}>
                              <Clock className="h-4 w-4 mr-2" />
                              Suspendre
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedBusiness(business);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'entreprise</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedBusiness?.name}" ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={deleteBusiness} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminEntreprises;
