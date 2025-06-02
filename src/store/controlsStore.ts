import { create } from "zustand";
import { areColorsTooSimilar, getContrastingColor } from "@/utils/colorUtils";

interface ControlsState {
  mugColor: string;
  strokeColor: string;
  setMugColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
}

export const useControlsStore = create<ControlsState>((set, get) => ({
  mugColor: "#000000", // Default mug color
  strokeColor: "#ffffff", // Default stroke color

  setMugColor: (color) => {
    const { strokeColor } = get();
    if (areColorsTooSimilar(color, strokeColor)) {
      set({
        mugColor: color,
        strokeColor: getContrastingColor(color),
      });
    } else {
      set({ mugColor: color });
    }
  },

  setStrokeColor: (color) => {
    const { mugColor } = get();
    if (areColorsTooSimilar(color, mugColor)) {
      set({
        strokeColor: color,
        mugColor: getContrastingColor(color),
      });
    } else {
      set({ strokeColor: color });
    }
  },
}));
