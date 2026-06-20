import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import View from "./view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import View from "./view";

const queryClient = new QueryClient();

createRoot(document.querySelector<HTMLBodyElement>("body")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/*<LiquidGlassDemo />*/}
      <View />
    </QueryClientProvider>
  </StrictMode>
);
