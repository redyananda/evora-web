import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v8";
import { Toaster } from "react-hot-toast";
import "./index.css";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import LazyOrganizerDashboard from "./components/organizer/LazyOrganizerDashboard";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  // ── Public routes ─────────────────────────────────────────────────────────
  {
    path: "/",
    lazy: async () => ({ Component: (await import("./pages/Home")).default }),
  },
  {
    path: "/events/:slug",
    lazy: async () => ({ Component: (await import("./pages/EventDetails")).default }),
  },
  {
    path: "/organizers/:id",
    lazy: async () => ({ Component: (await import("./pages/OrganizerProfile")).default }),
  },
  {
    path: "/how-it-works",
    lazy: async () => ({ Component: (await import("./pages/HowItWorks")).default }),
  },
  // ── Footer / static pages ─────────────────────────────────────────────────
  {
    path: "/about",
    lazy: async () => ({ Component: (await import("./pages/AboutUs")).default }),
  },
  {
    path: "/careers",
    lazy: async () => ({ Component: (await import("./pages/Careers")).default }),
  },
  {
    path: "/contact",
    lazy: async () => ({ Component: (await import("./pages/Contact")).default }),
  },
  {
    path: "/help",
    lazy: async () => ({ Component: (await import("./pages/HelpCenter")).default }),
  },
  {
    path: "/safety",
    lazy: async () => ({ Component: (await import("./pages/Safety")).default }),
  },
  {
    path: "/guides",
    lazy: async () => ({ Component: (await import("./pages/Guides")).default }),
  },
  {
    path: "/privacy",
    lazy: async () => ({ Component: (await import("./pages/PrivacyPolicy")).default }),
  },
  {
    path: "/terms",
    lazy: async () => ({ Component: (await import("./pages/TermsOfService")).default }),
  },
  {
    path: "/cookies",
    lazy: async () => ({ Component: (await import("./pages/CookiePolicy")).default }),
  },
  {
    path: "/login",
    lazy: async () => ({ Component: (await import("./pages/Login")).default }),
  },
  {
    path: "/register",
    lazy: async () => ({ Component: (await import("./pages/Register")).default }),
  },
  {
    path: "/unauthorized",
    lazy: async () => ({ Component: (await import("./pages/Unauthorized")).default }),
  },
  {
    path: "/forgot-password",
    lazy: async () => ({ Component: (await import("./pages/ForgotPassword")).default }),
  },
  {
    path: "/reset-password",
    lazy: async () => ({ Component: (await import("./pages/ResetPassword")).default }),
  },
     {
    path: "/organizer",
    element: (
      <ProtectedRoute allowedRoles={["ORGANIZER"]}>
        <LazyOrganizerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    element: <ProtectedRoute allowedRoles={["CUSTOMER"]}><Outlet /></ProtectedRoute>,
    children: [
      {
        path: "/events/:slug/purchase",
        lazy: async () => ({ Component: (await import("./pages/Purchase")).default }),
      },
      {
        path: "/events/:slug/payment",
        lazy: async () => ({ Component: (await import("./pages/Payment")).default }),
      },
    ],
  },
  {
    element: <ProtectedRoute><Outlet /></ProtectedRoute>,
    children: [
      {
        path: "/profile",
        lazy: async () => ({ Component: (await import("./pages/Profile")).default }),
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["ORGANIZER"]}><Outlet /></ProtectedRoute>,
    children: [
      {
        path: "/events/create",
        lazy: async () => ({ Component: (await import("./pages/CreateEvent")).default }),
      },
    ],
  },
  {
    path: "/organizer",
    element: (
      <ProtectedRoute allowedRoles={["ORGANIZER"]}>
        <LazyOrganizerDashboard />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </NuqsAdapter>
    </QueryClientProvider>
  </StrictMode>,
);
