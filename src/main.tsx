import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v8";
import { Toaster } from "react-hot-toast";
import "./index.css";

// Pages
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LazyOrganizerDashboard from "./components/organizer/LazyOrganizerDashboard";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Purchase from "./pages/Purchase";
import Payment from "./pages/Payment";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  // ── Public routes ─────────────────────────────────────────────────────────
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/events/:slug",
    element: <EventDetails />,
  },
  {
    path: "/events/:slug/purchase",
    element: (
      <ProtectedRoute>
        <Purchase />
      </ProtectedRoute>
    ),
  },
  {
    path: "/events/:slug/payment",
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/events/create",
    element: (
      <ProtectedRoute allowedRoles={["ORGANIZER", "ADMIN"]}>
        <CreateEvent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
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
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
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
