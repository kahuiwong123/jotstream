import { create } from "zustand";

type AuthState = {
  userId?: string;
  email?: string | null;
  setEmail: (email?: string | null) => void;
  setUserId: (userId?: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  setUserId: (id) => set({ userId: id }),
  setEmail: (email) => set({ email: email }),
}));
