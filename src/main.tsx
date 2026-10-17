import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  document.body.innerHTML = `
    <div style="padding:2rem; font-family:sans-serif; text-align:center;">
      <h1 style="color:#dc2626;">Erreur: élément #root introuvable</h1>
      <p>Le conteneur d'application est manquant dans le DOM.</p>
    </div>
  `;
} else {
  try {
    createRoot(rootElement).render(<App />);
  } catch (err: any) {
    rootElement.innerHTML = `
      <div style="padding:2rem; font-family:sans-serif; text-align:center; color:#dc2626;">
        <h1>Erreur de montage React</h1>
        <pre style="text-align:left; white-space:pre-wrap; break-word;">${String(err?.message || err)}</pre>
      </div>
    `;
    console.error("Erreur de montage React:", err);
  }
}
