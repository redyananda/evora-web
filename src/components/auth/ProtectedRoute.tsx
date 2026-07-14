import { Navigate, useLocation } from "react-router";
import { useAuthStore, type UserRole } from "@/store/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * If provided, only users with one of these roles can access the route.
   * If omitted, any authenticated user is allowed.
   */
  allowedRoles?: UserRole[];
}

/**
 * Wraps a route so that:
 * 1. Unauthenticated users are redirected to /login (with `state.from` set so
 *    the login page can redirect them back after sign-in).
 * 2. Authenticated users whose role is not in `allowedRoles` are redirected
 *    to /unauthorized (or /  if you prefer).
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  // Not logged in → send to login, remember intended destination
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Logged in but wrong role → send to /unauthorized
  if (allowedRoles && !allowedRoles.includes(user.userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
