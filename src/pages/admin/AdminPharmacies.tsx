import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Pill, Calendar, MapPin, Phone, Upload } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type Pharmacy = Database["public"]["Tables"]["pharmacies_garde"]["Row"] & {
  communes?: { name: string } | null;
  cities?: { name: string } | null;
};
type City = Database["public"]["Tables"]["cities"]["Row"];
type Commune = Database["public"]["Tables"]["communes"]["Row"];

const AdminPharmacies = () => {
  const { toast } = useToast();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [filteredCommunes, setFilteredCommunes] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    cityId: "",
    communeId: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.cityId) {
      setFilteredCommunes(communes.filter((c) => c.city_id === formData.cityId));
    } else {
      setFilteredCommunes([]);
    }
  }, [formData.cityId, communes]);

  const fetchData = async () => {
    try {
      const [pharmaciesRes, citiesRes, communesRes] = await Promise.all([
        supabase
          .from("pharmacies_garde")
          .select(`*, communes(name), cities(name)`)
          .order("start_date", { ascending: false }),
        supabase.from("cities").select("*").order("name"),
        supabase.from("communes").select("*").order("name"),
      ]);

      if (pharmaciesRes.data) setPharmacies(pharmaciesRes.data);
      if (citiesRes.data) setCities(citiesRes.data);
      if (communesRes.data) setCommunes(communesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingPharmacy(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      cityId: "",
      communeId: "",
      startDate: new Date(),
      endDate: new Date(),
    });
    setDialogOpen(true);
  };

  const openEditDialog = (pharmacy: Pharmacy) => {
    setEditingPharmacy(pharmacy);
    setFormData({
      name: pharmacy.name,
      address: pharmacy.address || "",
      phone: pharmacy.phone || "",
      cityId: pharmacy.city_id || "",
      communeId: pharmacy.commune_id || "",
      startDate: new Date(pharmacy.start_date),
      endDate: new Date(pharmacy.end_date),
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom est requis.",
        variant: "destructive",
      });
      return;
    }

    try {
      const pharmacyData = {
        name: formData.name,
        address: formData.address || null,
        phone: formData.phone || null,
        city_id: formData.cityId || null,
        commune_id: formData.communeId || null,
        start_date: format(formData.startDate, "yyyy-MM-dd"),
        end_date: format(formData.endDate, "yyyy-MM-dd"),
      };

      if (editingPharmacy) {
        const { error } = await supabase
          .from("pharmacies_garde")
          .update(pharmacyData)
          .eq("id", editingPharmacy.id);

        if (error) throw error;
        toast({ title: "Pharmacie mise à jour" });
      } else {
        const { error } = await supabase.from("pharmacies_garde").insert(pharmacyData);

        if (error) throw error;
        toast({ title: "Pharmacie ajoutée" });
      }

      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving pharmacy:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la pharmacie.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!editingPharmacy) return;

    try {
      const { error } = await supabase
        .from("pharmacies_garde")
        .delete()
        .eq("id", editingPharmacy.id);

      if (error) throw error;

      toast({ title: "Pharmacie supprimée" });
      setDeleteDialogOpen(false);
      setEditingPharmacy(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting pharmacy:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la pharmacie.",
        variant: "destructive",
      });
    }
  };

  const isCurrentlyOnDuty = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  return (
    <AdminLayout
      title="Pharmacies de garde"
      description="Gérez les pharmacies de garde par période"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pharmacies ({pharmacies.length})</CardTitle>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une pharmacie
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : pharmacies.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Aucune pharmacie de garde</p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une pharmacie
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {pharmacies.map((pharmacy) => {
                const onDuty = isCurrentlyOnDuty(pharmacy.start_date, pharmacy.end_date);
                return (
                  <div
                    key={pharmacy.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border transition-colors",
                      onDuty
                        ? "border-success/50 bg-success/5"
                        : "border-border bg-card hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
                          onDuty ? "bg-success/20" : "bg-muted"
                        )}
                      >
                        <Pill className={cn("h-6 w-6", onDuty ? "text-success" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{pharmacy.name}</h3>
                          {onDuty && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-success text-success-foreground rounded-full">
                              De garde
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                          {pharmacy.communes?.name && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {pharmacy.communes.name}
                            </span>
                          )}
                          {pharmacy.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {pharmacy.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(pharmacy.start_date), "dd/MM/yyyy", { locale: fr })} -{" "}
                            {format(new Date(pharmacy.end_date), "dd/MM/yyyy", { locale: fr })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(pharmacy)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setEditingPharmacy(pharmacy);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPharmacy ? "Modifier la pharmacie" : "Ajouter une pharmacie"}
            </DialogTitle>
            <DialogDescription>
              {editingPharmacy
                ? "Modifiez les informations de la pharmacie de garde"
                : "Ajoutez une pharmacie de garde pour une période donnée"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Pharmacie du Plateau"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+225 XX XX XX XX"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ville</Label>
                <Select
                  value={formData.cityId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cityId: value, communeId: "" })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Commune</Label>
                <Select
                  value={formData.communeId}
                  onValueChange={(value) => setFormData({ ...formData, communeId: value })}
                  disabled={!formData.cityId}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCommunes.map((commune) => (
                      <SelectItem key={commune.id} value={commune.id}>
                        {commune.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresse complète"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date de début *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1 justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(formData.startDate, "dd/MM/yyyy", { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Date de fin *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1 justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(formData.endDate, "dd/MM/yyyy", { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingPharmacy ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la pharmacie</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{editingPharmacy?.name}" ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminPharmacies;
