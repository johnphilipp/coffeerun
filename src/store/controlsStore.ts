import { activityTypeDefinitions } from "@/config/activityTypeDefinitions";
import { ActivityTypeDefinition } from "@/types/activityTypeDefinition";
import { areColorsSame, getContrastingColor } from "@/utils/colorUtils";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { create } from "zustand";

interface ControlsState {
  mugColor: string;
  strokeColor: string;
  selectedActivityTypes: ActivityTypeDefinition[];
  selectedDateRange: DateRange | undefined;
  selectedYears: number[];
  setMugColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  toggleActivityType: (toggledActivityType: ActivityTypeDefinition) => void;
  setSelectedActivityTypes: (
    selectedActivityTypes: ActivityTypeDefinition[]
  ) => void; // TODO: Check if this can be removed?
  setSelectedDateRange: (dateRange: DateRange | undefined) => void; // Needs to be "undefined" as per DayPickerRangeProps
  toggleYear: (year: number) => void;
}

export const useControlsStore = create<ControlsState>((set, get) => ({
  mugColor: "#000000",
  strokeColor: "#ffffff",
  selectedActivityTypes: activityTypeDefinitions,
  selectedDateRange: undefined,
  selectedYears: [],

  setMugColor: (color) => {
    const { strokeColor } = get();
    if (areColorsSame(color, strokeColor)) {
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
    if (areColorsSame(color, mugColor)) {
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
    set({ selectedDateRange: dateRange, selectedYears: [] });
  },

  toggleYear: (year: number) => {
    const { selectedYears } = get();

    if (selectedYears.includes(year)) {
      const minYear = Math.min(...selectedYears);
      const maxYear = Math.max(...selectedYears);
      if (year > minYear && year < maxYear) {
        toast.info("Only continuous date ranges are possible");
        return;
      }
    }

    const newSelectedYears = selectedYears.includes(year)
      ? selectedYears.filter((y) => y !== year)
      : [...selectedYears, year];

    if (newSelectedYears.length === 0) {
      set({
        selectedYears: [],
        selectedDateRange: undefined,
      });
      return;
    }

    const minYear = Math.min(...newSelectedYears);
    const maxYear = Math.max(...newSelectedYears);

    const allYearsInRange = Array.from(
      { length: maxYear - minYear + 1 },
      (_, i) => minYear + i
    );

    set({
      selectedYears: allYearsInRange,
      selectedDateRange: {
        from: new Date(minYear, 0, 1),
        to: new Date(maxYear, 11, 31),
      },
    });
  },
}));
