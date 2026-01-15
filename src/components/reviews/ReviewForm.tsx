import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ReviewFormProps {
  businessId: string;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ businessId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour laisser un avis.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez sélectionner une note.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Commentaire trop court",
        description: "Votre commentaire doit contenir au moins 10 caractères.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        business_id: businessId,
        user_id: user.id,
        rating,
        comment: comment.trim(),
        is_approved: false, // Reviews need moderation
      });

      if (error) throw error;

      toast({
        title: "Avis envoyé !",
        description: "Votre avis sera publié après modération.",
      });

      setRating(0);
      setComment("");
      onReviewSubmitted();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'avis.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-muted/50 rounded-xl p-6 text-center">
        <p className="text-muted-foreground mb-3">
          Connectez-vous pour laisser un avis
        </p>
        <Button asChild>
          <a href="/connexion">Se connecter</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border">
      <h4 className="font-semibold text-foreground mb-4">Donner votre avis</h4>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm text-muted-foreground mb-2">
          Votre note
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-amber-500 fill-amber-500"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm text-muted-foreground mb-2">
          Votre commentaire
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience..."
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {comment.length}/1000
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Envoi en cours..." : "Envoyer mon avis"}
      </Button>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Votre avis sera vérifié avant publication
      </p>
    </form>
  );
}
