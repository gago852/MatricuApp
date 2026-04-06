import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { MatricuApp } from "./MatricuApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MatricuApp />
  </StrictMode>
);
