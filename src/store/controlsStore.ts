import { activityTypeDefinitions } from "@/config/activityTypeDefinitions";
import { ActivityTypeDefinition } from "@/types/activityTypeDefinition";
import { areColorsTooSimilar, getContrastingColor } from "@/utils/colorUtils";
import { create } from "zustand";

interface ControlsState {
  mugColor: string;
  strokeColor: string;
  selectedActivityTypes: ActivityTypeDefinition[];
  setMugColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  toggleActivityType: (toggledActivityType: ActivityTypeDefinition) => void;
  setSelectedActivityTypes: (
    selectedActivityTypes: ActivityTypeDefinition[]
  ) => void;
}

export const useControlsStore = create<ControlsState>((set, get) => ({
  mugColor: "#000000", // Default mug color
  strokeColor: "#ffffff", // Default stroke color
  selectedActivityTypes: activityTypeDefinitions,

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

  toggleActivityType: (toggledActivityType) => {
    const { selectedActivityTypes } = get();
    const isSelected = selectedActivityTypes.includes(toggledActivityType);

    if (isSelected) {
      // Remove if already selected
      set({
        selectedActivityTypes: selectedActivityTypes.filter(
          (selectedActivityType) => selectedActivityType !== toggledActivityType
        ),
      });
    } else {
      // Add if not selected
      set({
        selectedActivityTypes: [...selectedActivityTypes, toggledActivityType],
      });
    }
  },

  setSelectedActivityTypes: (selectedActivityTypes) => {
    set({ selectedActivityTypes: selectedActivityTypes });
  },
}));
