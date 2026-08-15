import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  avatarUrl?: string;
  role?: "consumer" | "partner";
}



interface AuthState {
  user: User | null;
  token: string | null;
  role: "consumer" | "partner" | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (user: User, token: string, role?: "consumer" | "partner" | null) => void;
  logout: () => void;
  clearUser: () => void;
  setUser: (user: User) => void;
  setRole: (role: "consumer" | "partner") => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token, role = null) => 
        set({ user, token, role, isAuthenticated: true }),
      
      logout: () => 
        set({ user: null, token: null, role: null, isAuthenticated: false }),
      
      clearUser: () =>
        set({ user: null, token: null, role: null, isAuthenticated: false }),

      setUser: (user) => 
        set({ user }),

      setRole: (role) => 
        set({ role }),
        
      setLoading: (isLoading) => 
        set({ isLoading }),
    }),
    {
      name: "auth-storage", // stores in localStorage by default
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        role: state.role, 
        isAuthenticated: state.isAuthenticated 
      }), // only persist these fields
    }
  )
);
