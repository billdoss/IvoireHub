import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ============================================================
// Diagnostic global : affiche toute erreur non capturée dans le DOM
// ============================================================
function showDiagnostic(message: string) {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `
    <div style="padding:2rem; font-family:system-ui,sans-serif; text-align:center; color:#dc2626;">
      <h1 style="font-size:1.5rem; margin-bottom:1rem;">Erreur d'application</h1>
      <pre style="text-align:left; white-space:pre-wrap; break-word; font-size:0.875rem; background:#fef2f2; padding:1rem; border-radius:0.5rem;">${message}</pre>
      <p style="margin-top:1rem; font-size:0.875rem; color:#6b7280;">Ouvrez la console F12 pour plus de détails.</p>
    </div>
  };
}

window.addEventListener("error", (event) => {
  console.error("Erreur globale capturée:", event.error);
  showDiagnostic(event.error?.message || String(event.message));
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Promise rejetée non gérée:", event.reason);
  showDiagnostic(String(event.reason?.message || event.reason));
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  showDiagnostic("Élément #root introuvable dans le DOM.");
} else {
  try {
    createRoot(rootElement).render(<App />);
  } catch (err: any) {
    showDiagnostic(String(err?.message || err));
    console.error("Erreur de montage React:", err);
  }
}
