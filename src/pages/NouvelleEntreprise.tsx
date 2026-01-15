import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Loader2, MapPin, Phone, Globe, Info, Clock, Image } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type City = Database["public"]["Tables"]["cities"]["Row"];
type Commune = Database["public"]["Tables"]["communes"]["Row"];

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const NouvelleEntreprise = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [filteredCommunes, setFilteredCommunes] = useState<Commune[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    descriptionShort: "",
    descriptionLong: "",
    phone: "",
    phoneSecondary: "",
    email: "",
    website: "",
    cityId: "",
    communeId: "",
    address: "",
    landmark: "",
    whatsapp: "",
    facebookUrl: "",
    instagramUrl: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/connexion");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.cityId) {
      setFilteredCommunes(communes.filter((c) => c.city_id === formData.cityId));
      setFormData((prev) => ({ ...prev, communeId: "" }));
    }
  }, [formData.cityId, communes]);

  const fetchData = async () => {
    try {
      const [categoriesRes, citiesRes, communesRes] = await Promise.all([
        supabase.from("categories").select("*").is("parent_id", null).order("sort_order"),
        supabase.from("cities").select("*").order("name"),
        supabase.from("communes").select("*").order("name"),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (citiesRes.data) setCities(citiesRes.data);
      if (communesRes.data) setCommunes(communesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de l'entreprise est requis.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const slug = generateSlug(formData.name) + "-" + Date.now().toString(36);
      
      const { error } = await supabase.from("businesses").insert({
        user_id: user.id,
        name: formData.name,
        slug,
        category_id: formData.categoryId || null,
        description_short: formData.descriptionShort || null,
        description_long: formData.descriptionLong || null,
        phone: formData.phone || null,
        phone_secondary: formData.phoneSecondary || null,
        email: formData.email || null,
        website: formData.website || null,
        city_id: formData.cityId || null,
        commune_id: formData.communeId || null,
        address: formData.address || null,
        landmark: formData.landmark || null,
        whatsapp: formData.whatsapp || null,
        facebook_url: formData.facebookUrl || null,
        instagram_url: formData.instagramUrl || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Entreprise créée",
        description: "Votre fiche est en attente de validation.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating business:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'entreprise. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
        <div className="container py-8 max-w-3xl">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Nouvelle entreprise
            </h1>
            <p className="text-muted-foreground mt-1">
              Remplissez les informations de votre entreprise
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informations générales
                </CardTitle>
                <CardDescription>
                  Les informations de base de votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de l'entreprise *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Ex: Restaurant Le Plateau"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleChange("categoryId", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descriptionShort">Description courte</Label>
                  <Input
                    id="descriptionShort"
                    value={formData.descriptionShort}
                    onChange={(e) => handleChange("descriptionShort", e.target.value)}
                    placeholder="Une phrase décrivant votre activité"
                    className="mt-1"
                    maxLength={150}
                  />
                </div>

                <div>
                  <Label htmlFor="descriptionLong">Description détaillée</Label>
                  <Textarea
                    id="descriptionLong"
                    value={formData.descriptionLong}
                    onChange={(e) => handleChange("descriptionLong", e.target.value)}
                    placeholder="Décrivez votre entreprise en détail..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact
                </CardTitle>
                <CardDescription>
                  Comment vos clients peuvent vous joindre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone principal</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+225 XX XX XX XX"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneSecondary">Téléphone secondaire</Label>
                    <Input
                      id="phoneSecondary"
                      type="tel"
                      value={formData.phoneSecondary}
                      onChange={(e) => handleChange("phoneSecondary", e.target.value)}
                      placeholder="+225 XX XX XX XX"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="contact@entreprise.ci"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      placeholder="+225 XX XX XX XX"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    placeholder="https://www.entreprise.ci"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localisation
                </CardTitle>
                <CardDescription>
                  Où se trouve votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Select
                      value={formData.cityId}
                      onValueChange={(value) => handleChange("cityId", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une ville" />
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
                    <Label htmlFor="commune">Commune</Label>
                    <Select
                      value={formData.communeId}
                      onValueChange={(value) => handleChange("communeId", value)}
                      disabled={!formData.cityId}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une commune" />
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
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Rue, numéro, quartier..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="landmark">Point de repère</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => handleChange("landmark", e.target.value)}
                    placeholder="Ex: À côté de la pharmacie..."
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Réseaux sociaux
                </CardTitle>
                <CardDescription>
                  Vos profils sur les réseaux sociaux
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.facebookUrl}
                      onChange={(e) => handleChange("facebookUrl", e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.instagramUrl}
                      onChange={(e) => handleChange("instagramUrl", e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer l'entreprise
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NouvelleEntreprise;
