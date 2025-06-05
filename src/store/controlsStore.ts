import { activityTypeDefinitions } from "@/config/activityTypeDefinitions";
import { ActivityTypeDefinition } from "@/types/activityTypeDefinition";
import { areColorsTooSimilar, getContrastingColor } from "@/utils/colorUtils";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

interface ControlsState {
  mugColor: string;
  strokeColor: string;
  selectedActivityTypes: ActivityTypeDefinition[];
  selectedDateRange: DateRange | undefined;
  setMugColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  toggleActivityType: (toggledActivityType: ActivityTypeDefinition) => void;
  setSelectedActivityTypes: (
    selectedActivityTypes: ActivityTypeDefinition[]
  ) => void; // TODO: Check if this can be removed?
  setSelectedDateRange: (dateRange: DateRange | undefined) => void; // Needs to be "undefined" as per DayPickerRangeProps
}

export const useControlsStore = create<ControlsState>((set, get) => ({
  mugColor: "#000000",
  strokeColor: "#ffffff",
  selectedActivityTypes: activityTypeDefinitions,
  selectedDateRange: undefined,

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

  setSelectedDateRange: (dateRange) => {
    set({ selectedDateRange: dateRange });
  },
}));
