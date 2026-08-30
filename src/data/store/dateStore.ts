import { create } from "zustand";

interface DateState {
  activeDate: Date | null;
  setActiveDate: (date: Date | null) => void;
}

export const useDateStore = create<DateState>((set) => ({
  activeDate: null,
  setActiveDate: (date) => set({ activeDate: date }),
}));
