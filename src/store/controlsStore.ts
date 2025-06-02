import { create } from "zustand";

interface ControlsState {
  mugColor: string;
  setMugColor: (color: string) => void;
}

export const useControlsStore = create<ControlsState>((set) => ({
  mugColor: "#e4c192", // Default mug color
  setMugColor: (color) => set({ mugColor: color }),
}));
