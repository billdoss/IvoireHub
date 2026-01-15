import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Newspaper, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];

const AdminArticles = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    featuredImage: "",
    isPublished: false,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingArticle ? formData.slug : generateSlug(title),
    });
  };

  const openCreateDialog = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      featuredImage: "",
      isPublished: false,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content,
      category: article.category || "",
      featuredImage: article.featured_image || "",
      isPublished: article.is_published || false,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et le contenu sont requis.",
        variant: "destructive",
      });
      return;
    }

    try {
      const articleData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt || null,
        content: formData.content,
        category: formData.category || null,
        featured_image: formData.featuredImage || null,
        is_published: formData.isPublished,
        published_at: formData.isPublished ? new Date().toISOString() : null,
        author_id: user?.id,
      };

      if (editingArticle) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", editingArticle.id);

        if (error) throw error;
        toast({ title: "Article mis à jour" });
      } else {
        const { error } = await supabase.from("articles").insert(articleData);

        if (error) throw error;
        toast({ title: "Article créé" });
      }

      setDialogOpen(false);
      fetchArticles();
    } catch (error: any) {
      console.error("Error saving article:", error);
      toast({
        title: "Erreur",
        description: error.message?.includes("duplicate")
          ? "Ce slug existe déjà."
          : "Impossible de sauvegarder l'article.",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (article: Article) => {
    try {
      const newStatus = !article.is_published;
      const { error } = await supabase
        .from("articles")
        .update({
          is_published: newStatus,
          published_at: newStatus ? new Date().toISOString() : null,
        })
        .eq("id", article.id);

      if (error) throw error;

      setArticles(
        articles.map((a) =>
          a.id === article.id ? { ...a, is_published: newStatus } : a
        )
      );
      toast({
        title: newStatus ? "Article publié" : "Article dépublié",
      });
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!editingArticle) return;

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", editingArticle.id);

      if (error) throw error;

      toast({ title: "Article supprimé" });
      setDeleteDialogOpen(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout
      title="Gestion des articles"
      description="Publiez et gérez les actualités"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Articles ({articles.length})</CardTitle>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel article
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Aucun article</p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un article
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {article.featured_image && (
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="h-16 w-24 object-cover rounded-lg shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-foreground">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {article.excerpt || "Pas d'extrait"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(article.created_at), "dd MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={article.is_published ? "default" : "secondary"}>
                      {article.is_published ? "Publié" : "Brouillon"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublish(article)}
                    >
                      {article.is_published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(article)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setEditingArticle(article);
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
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "Modifier l'article" : "Nouvel article"}
            </DialogTitle>
            <DialogDescription>
              {editingArticle
                ? "Modifiez les informations de l'article"
                : "Créez un nouvel article pour les actualités"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Titre de l'article"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-de-larticle"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Économie"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="featuredImage">Image URL</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="excerpt">Extrait</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Résumé court de l'article..."
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Contenu de l'article..."
                className="mt-1 min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setFormData({ ...formData, isPublished: false });
                handleSubmit();
              }}
            >
              Enregistrer en brouillon
            </Button>
            <Button
              onClick={() => {
                setFormData({ ...formData, isPublished: true });
                handleSubmit();
              }}
            >
              Publier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'article</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{editingArticle?.title}" ?
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

export default AdminArticles;
