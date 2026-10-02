import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";

// Le vrai client Supabase declencherait des appels reseau au montage.
// Seule l'auth (et, si un utilisateur est present, la lecture de user_roles)
// est utilisee par les composants rendus ici : on la remplace par un stub.
vi.mock("@/integrations/supabase/client", () => {
  const queryBuilder: Record<string, unknown> = {};
  const chain = () => queryBuilder;
  Object.assign(queryBuilder, {
    select: chain,
    eq: chain,
    neq: chain,
    is: chain,
    in: chain,
    or: chain,
    order: chain,
    limit: chain,
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    single: () => Promise.resolve({ data: null, error: null }),
  });

  return {
    supabase: {
      from: () => queryBuilder,
      auth: {
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signUp: () => Promise.resolve({ error: null }),
        signInWithPassword: () => Promise.resolve({ error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
    },
  };
});

import App from "@/App";

/** Doit correspondre a `base` de vite.config.ts. */
const BASE_URL = "/IvoireHub/";

/**
 * Rend l'application puis laisse se resoudre le getSession() d'AuthProvider
 * a l'interieur d'un act() pour eviter les warnings React.
 */
async function renderApp() {
  render(<App />);
  await act(async () => {
    await Promise.resolve();
  });
}

describe("routage depuis le sous-chemin de deploiement", () => {
  beforeEach(() => {
    window.history.pushState({}, "", BASE_URL);
  });

  afterEach(() => {
    cleanup();
  });

  it("expose le meme base que vite.config.ts via import.meta.env.BASE_URL", () => {
    expect(import.meta.env.BASE_URL).toBe(BASE_URL);
  });

  it("affiche la page d'accueil sur BASE_URL au lieu de la page 404", async () => {
    await renderApp();

    expect(screen.queryByText("Oops! Page not found")).not.toBeInTheDocument();
    expect(screen.queryByText("404")).not.toBeInTheDocument();
  });

  it("affiche toujours la 404 sur une route reellement inexistante", async () => {
    window.history.pushState({}, "", `${BASE_URL}route-qui-nexiste-pas`);

    await renderApp();

    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
  });
});