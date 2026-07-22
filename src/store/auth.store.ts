import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "CUSTOMER" | "ORGANIZER";

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userRole: UserRole;
  referralCode: string | null;
  profilePicture: string | null;
  userPoint: number;
  phoneNumber?: string | null;
  address?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: AuthUser, token: string) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
// Persists to localStorage so the user stays logged in across page reloads.

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      updateUser: (user) =>
        set({ user, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "evora-auth", // localStorage key
    }
  )
);
