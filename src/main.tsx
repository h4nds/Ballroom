import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initApiClient } from "./lib/api";

void initApiClient().catch((err: unknown) => {
  console.warn("[api] bootstrap skipped — start Rails on :3000 for /api (see package.json dev:api).", err);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
