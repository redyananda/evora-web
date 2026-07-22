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

// Auth guard
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
  },{

    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },

  // ── Protected: any authenticated user ────────────────────────────────────
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },

  // ── Protected: CUSTOMER only ──────────────────────────────────────────────
  // Example: my tickets
  // {
  //   path: "/my-tickets",
  //   element: (
  //     <ProtectedRoute allowedRoles={["CUSTOMER"]}>
  //       <MyTickets />
  //     </ProtectedRoute>
  //   ),
  // },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </NuqsAdapter>
    </QueryClientProvider>
  </StrictMode>
);
