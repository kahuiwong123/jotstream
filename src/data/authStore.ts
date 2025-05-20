import { create } from "zustand";

type AuthState = {
  userId?: string;
  setUserId: (userId?: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  setUserId: (id) => set({ userId: id }),
}));
