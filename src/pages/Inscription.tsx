import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, MapPin, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const Inscription = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    const newErrors: string[] = [];
    if (password.length < 8) {
      newErrors.push("Au moins 8 caractères");
    }
    if (password !== confirmPassword) {
      newErrors.push("Les mots de passe ne correspondent pas");
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validatePassword();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors([]);
    setIsLoading(true);

    const { error } = await signUp(email, password, fullName);
    
    if (!error) {
      navigate("/");
    }
    
    setIsLoading(false);
  };

  const passwordChecks = [
    { label: "Au moins 8 caractères", valid: password.length >= 8 },
    { label: "Mots de passe identiques", valid: password === confirmPassword && confirmPassword.length > 0 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Annuaire<span className="text-primary">CI</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Créer un compte</h1>
          <p className="mt-2 text-muted-foreground">
            Inscrivez votre entreprise sur AnnuaireCI
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>

            {/* Password requirements */}
            <div className="space-y-2">
              {passwordChecks.map((check, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center ${
                      check.valid ? "bg-success text-success-foreground" : "bg-muted"
                    }`}
                  >
                    {check.valid && <Check className="h-3 w-3" />}
                  </div>
                  <span className={check.valid ? "text-foreground" : "text-muted-foreground"}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>

            {errors.length > 0 && (
              <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer mon compte
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Déjà inscrit ?{" "}
          <Link to="/connexion" className="font-medium text-primary hover:underline">
            Se connecter
          </Link>
        </p>

        <p className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Inscription;
