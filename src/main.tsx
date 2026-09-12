import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const container = document.getElementById("root")!;

const tree = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Pre-rendered pages ship their markup inside #root and are hydrated; the dev
// server and any empty shell still mount from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
