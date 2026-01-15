import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, FolderTree, GripVertical, ChevronRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

const AdminCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: "",
    description: "",
    parentId: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingCategory ? formData.slug : generateSlug(name),
    });
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", icon: "", description: "", parentId: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || "",
      description: category.description || "",
      parentId: category.parent_id || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom et le slug sont requis.",
        variant: "destructive",
      });
      return;
    }

    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        icon: formData.icon || null,
        description: formData.description || null,
        parent_id: formData.parentId || null,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast({ title: "Catégorie mise à jour" });
      } else {
        const { error } = await supabase.from("categories").insert(categoryData);

        if (error) throw error;
        toast({ title: "Catégorie créée" });
      }

      setDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast({
        title: "Erreur",
        description: error.message?.includes("duplicate")
          ? "Ce slug existe déjà."
          : "Impossible de sauvegarder la catégorie.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", editingCategory.id);

      if (error) throw error;

      toast({ title: "Catégorie supprimée" });
      setDeleteDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie.",
        variant: "destructive",
      });
    }
  };

  const parentCategories = categories.filter((c) => !c.parent_id);
  const getSubcategories = (parentId: string) =>
    categories.filter((c) => c.parent_id === parentId);

  return (
    <AdminLayout
      title="Gestion des catégories"
      description="Organisez les catégories de l'annuaire"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Catégories ({categories.length})</CardTitle>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle catégorie
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Aucune catégorie</p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une catégorie
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {parentCategories.map((category) => {
                const subcategories = getSubcategories(category.id);
                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FolderTree className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{category.name}</p>
                          <p className="text-xs text-muted-foreground">/{category.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setEditingCategory(category);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Subcategories */}
                    {subcategories.length > 0 && (
                      <div className="ml-8 mt-2 space-y-2">
                        {subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-foreground">{sub.name}</p>
                                <p className="text-xs text-muted-foreground">/{sub.slug}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(sub)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  setEditingCategory(sub);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Modifiez les informations de la catégorie"
                : "Ajoutez une nouvelle catégorie à l'annuaire"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Restaurants"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="ex: restaurants"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="icon">Icône (Lucide)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Ex: Utensils"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="parent">Catégorie parente</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) => setFormData({ ...formData, parentId: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Aucune (catégorie principale)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune</SelectItem>
                  {parentCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de la catégorie..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingCategory ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{editingCategory?.name}" ? Les sous-catégories associées seront également affectées.
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

export default AdminCategories;
