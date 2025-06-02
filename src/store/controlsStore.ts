import { create } from "zustand";
import { areColorsTooSimilar, getContrastingColor } from "@/utils/colorUtils";
import { activityTypes } from "@/config/activityTypes";

interface ControlsState {
  mugColor: string;
  strokeColor: string;
  selectedActivityTypes: string[];
  setMugColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  toggleActivityType: (type: string) => void;
  setSelectedActivityTypes: (types: string[]) => void;
}

export const useControlsStore = create<ControlsState>((set, get) => ({
  mugColor: "#000000", // Default mug color
  strokeColor: "#ffffff", // Default stroke color
  selectedActivityTypes: activityTypes.map((type) => type.type), // All types selected by default

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

  toggleActivityType: (type) => {
    const { selectedActivityTypes } = get();
    const isSelected = selectedActivityTypes.includes(type);

    if (isSelected) {
      // Remove if already selected
      set({
        selectedActivityTypes: selectedActivityTypes.filter((t) => t !== type),
      });
    } else {
      // Add if not selected
      set({
        selectedActivityTypes: [...selectedActivityTypes, type],
      });
    }
  },

  setSelectedActivityTypes: (types) => {
    set({ selectedActivityTypes: types });
  },
}));
