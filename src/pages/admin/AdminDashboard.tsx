import { useEffect, useState } from "react";
import { Building2, Users, Eye, Clock, CheckCircle, XCircle, TrendingUp, Pill } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type Business = Database["public"]["Tables"]["businesses"]["Row"] & {
  profiles?: { full_name: string | null; email: string } | null;
  categories?: { name: string } | null;
};

interface Stats {
  totalBusinesses: number;
  pendingBusinesses: number;
  approvedBusinesses: number;
  totalViews: number;
  totalUsers: number;
  totalPharmacies: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalBusinesses: 0,
    pendingBusinesses: 0,
    approvedBusinesses: 0,
    totalViews: 0,
    totalUsers: 0,
    totalPharmacies: 0,
  });
  const [recentBusinesses, setRecentBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all stats in parallel
      const [businessesRes, usersRes, pharmaciesRes, recentRes] = await Promise.all([
        supabase.from("businesses").select("id, status, views_count"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("pharmacies_garde").select("id", { count: "exact", head: true }),
        supabase
          .from("businesses")
          .select(`*, categories(name)`)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (businessesRes.data) {
        const businesses = businessesRes.data;
        setStats({
          totalBusinesses: businesses.length,
          pendingBusinesses: businesses.filter((b) => b.status === "pending").length,
          approvedBusinesses: businesses.filter((b) => b.status === "approved").length,
          totalViews: businesses.reduce((sum, b) => sum + (b.views_count || 0), 0),
          totalUsers: usersRes.count || 0,
          totalPharmacies: pharmaciesRes.count || 0,
        });
      }

      if (recentRes.data) {
        setRecentBusinesses(recentRes.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Entreprises",
      value: stats.totalBusinesses,
      icon: Building2,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "En attente",
      value: stats.pendingBusinesses,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      label: "Approuvées",
      value: stats.approvedBusinesses,
      icon: CheckCircle,
      color: "bg-success/10 text-success",
    },
    {
      label: "Vues totales",
      value: stats.totalViews,
      icon: Eye,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Utilisateurs",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      label: "Pharmacies",
      value: stats.totalPharmacies,
      icon: Pill,
      color: "bg-teal-500/10 text-teal-600",
    },
  ];

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "approved":
        return <Badge variant="default">Approuvé</Badge>;
      case "pending":
        return <Badge variant="outline">En attente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout
      title="Tableau de bord"
      description="Vue d'ensemble de votre plateforme"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "-" : stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Businesses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dernières inscriptions</CardTitle>
              <CardDescription>Entreprises récemment ajoutées</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/entreprises")}>
              Voir tout
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : recentBusinesses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune entreprise inscrite
              </p>
            ) : (
              <div className="space-y-4">
                {recentBusinesses.map((business) => (
                  <div
                    key={business.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/entreprises/${business.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        {business.logo_url ? (
                          <img
                            src={business.logo_url}
                            alt={business.name}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{business.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {business.categories?.name || "Sans catégorie"}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(business.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accès direct aux fonctionnalités</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/entreprises?status=pending")}
            >
              <Clock className="h-4 w-4 mr-3 text-yellow-600" />
              Valider les entreprises en attente
              {stats.pendingBusinesses > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {stats.pendingBusinesses}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/categories")}
            >
              <TrendingUp className="h-4 w-4 mr-3 text-primary" />
              Gérer les catégories
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/pharmacies")}
            >
              <Pill className="h-4 w-4 mr-3 text-teal-600" />
              Gérer les pharmacies de garde
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/articles")}
            >
              <TrendingUp className="h-4 w-4 mr-3 text-blue-600" />
              Publier un article
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
