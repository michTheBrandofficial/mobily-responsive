import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import View from "./view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LiquidGlassDemo } from "@/components/ui/liquid-glass-demo";

const queryClient = new QueryClient();

createRoot(document.querySelector<HTMLBodyElement>("body")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Interactive Refraction Lab */}
      <LiquidGlassDemo />

      {/* Uncomment to see original view */}
      {/* <View /> */}
    </QueryClientProvider>
  </StrictMode>
);
