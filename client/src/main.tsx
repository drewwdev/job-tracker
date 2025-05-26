import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ShowDemoProvider } from "./context/ShowDemoContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ShowDemoProvider>
      <App />
    </ShowDemoProvider>
  </StrictMode>
);
