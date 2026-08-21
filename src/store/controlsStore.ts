import { activityTypeDefinitions } from "@/config/activityTypeDefinitions";
import { ActivityTypeDefinition } from "@/types/activityTypeDefinition";
import { Activity } from "@/types/activity";
import { areColorsSame, getContrastingColor } from "@/utils/colorUtils";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ControlsState {
  mugColor: string;
  strokeColor: string;
  selectedActivityTypes: ActivityTypeDefinition[];
  selectedDateRange: DateRange | undefined;
  selectedYears: number[];
  selectedActivities: Activity[];
  isRotationPaused: boolean;
  toggleActivity: (activity: Activity) => void;
  setSelectedActivities: (activities: Activity[]) => void;
  setMugColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  toggleActivityType: (toggledActivityType: ActivityTypeDefinition) => void;
  setSelectedActivityTypes: (
    selectedActivityTypes: ActivityTypeDefinition[]
  ) => void; // TODO: Check if this can be removed?
  setSelectedDateRange: (dateRange: DateRange | undefined) => void; // Needs to be "undefined" as per DayPickerRangeProps
  toggleYear: (year: number) => void;
  pauseRotation: () => void;
  resumeRotation: () => void;
  toggleRotation: () => void;
}

export const useControlsStore = create<ControlsState>()(
  persist(
    (set, get) => ({
      mugColor: "#000000",
      strokeColor: "#ffffff",
      selectedActivityTypes: activityTypeDefinitions,
      selectedDateRange: undefined,
      selectedYears: [],
      selectedActivities: [],
      isRotationPaused: false,

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

      toggleActivity: (activity: Activity) => {
        const { selectedActivities } = get();
        const isSelected = selectedActivities.includes(activity);

        if (isSelected) {
          // Remove if already selected
          set({
            selectedActivities: selectedActivities.filter(
              (selectedActivity) => selectedActivity !== activity
            ),
          });
        } else {
          // Add if not selected
          set({
            selectedActivities: [...selectedActivities, activity],
          });
        }
      },

      setSelectedActivities: (activities: Activity[]) => {
        set({ selectedActivities: activities });
      },

      pauseRotation: () => {
        set({ isRotationPaused: true });
      },

      resumeRotation: () => {
        set({ isRotationPaused: false });
      },

      toggleRotation: () => {
        const { isRotationPaused } = get();
        set({ isRotationPaused: !isRotationPaused });
      },
    }),
    {
      name: "coffeerun-controls",
      skipHydration: true,
      version: 1,
      // Colors are trivially reproducible, unlike someone's rides, so a
      // damaged value here is self-healed rather than surfaced: drop the key
      // so it stops failing on every load and let the defaults stand. Without
      // this hook the error was swallowed entirely and the bad value survived
      // forever, since the library's reset only clears its own key.
      onRehydrateStorage: () => (_state, error) => {
        if (!error) return;
        try {
          localStorage.removeItem("coffeerun-controls");
        } catch {
          // Storage is unavailable; nothing to clean up.
        }
      },
      // See libraryStore: present so a future version bump can't take the
      // silent-wipe branch.
      migrate: (persisted) => persisted as ControlsState,
      // Colors only. Selections and the date range are re-derived by
      // activityStore.setActivities() on load, which also means no Date objects
      // cross localStorage and plain JSON stays lossless.
      partialize: (state) => ({
        mugColor: state.mugColor,
        strokeColor: state.strokeColor,
      }),
    }
  )
);
