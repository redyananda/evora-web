import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v8";
import "./index.css";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import HowItWorks from "./pages/HowItWorks";

const queryClient = new QueryClient();

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/events/:slug",
    element: <EventDetails />
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <RouterProvider router={router} />
      </NuqsAdapter>
    </QueryClientProvider>
  </StrictMode>
);
