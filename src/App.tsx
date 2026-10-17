import { useEffect, useState } from "react";

// Version minimale pour diagnostic : affiche les variables d'environnement et teste React
export default function App() {
  const [envInfo, setEnvInfo] = useState<{ url: string | null; key: string | null }>({
    url: null,
    key: null,
  });

  useEffect(() => {
    setEnvInfo({
      url: import.meta.env.VITE_SUPABASE_URL || null,
      key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || null,
    });
  }, []);

  return (
    <div style="padding: 2rem; font-family: system-ui, sans-serif; text-align: center;">
      <h1 style="color: #10b981;">✅ React fonctionne</h1>
      <p>Si vous voyez ce message, le bundle JS se charge correctement.</p>

      <div style="margin-top: 2rem; text-align: left; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #374151;">Variables d'environnement :</h2>
        <p>
          <strong>VITE_SUPABASE_URL :</strong> {envInfo.url ? `✅ Défini (${envInfo.url.substring(0, 30)}...)` : '❌ MANQUANT'}
        </p>
        <p>
          <strong>VITE_SUPABASE_PUBLISHABLE_KEY :</strong> {envInfo.key ? '✅ Défini' : '❌ MANQUANT'}
        </p>
      </div>

      {envInfo.url && envInfo.key ? (
        <div style="margin-top: 2rem; padding: 1rem; background: #d1fae5; border-radius: 0.5rem; color: #065f46;">
          <p>Les variables Supabase sont présentes. L'application devrait pouvoir se connecter.</p>
        </div>
      ) : (
        <div style="margin-top: 2rem; padding: 1rem; background: #fee2e2; border-radius: 0.5rem; color: #991b1b;">
          <p>Une ou plusieurs variables Supabase sont manquantes. Vérifiez les secrets GitHub Actions.</p>
        </div>
      )}
    </div>
  );
}
