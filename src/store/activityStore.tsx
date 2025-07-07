import { activityTypeDefinitions } from "@/config/activityTypeDefinitions";
import { useControlsStore } from "@/store/controlsStore";
import { Activity } from "@/types/activity";
import { ActivityTypeDefinition } from "@/types/activityTypeDefinition";
import { createImage } from "@/utils/imageUtils";
import { ActivityIcon } from "lucide-react";
import { create } from "zustand";
import { isEqual } from "lodash";

interface ActivityState {
  activities: Activity[];
  validActivities: Activity[];
  filteredActivities: Activity[];
  activityTypes: ActivityTypeDefinition[];
  validActivityTypes: ActivityTypeDefinition[];
  years: number[];
  generatedImage: string;
  setActivities: (activities: Activity[]) => void;
  setValidActivities: () => void;
  setFilteredActivities: () => void;
  setActivityTypes: () => void;
  setValidActivityTypes: () => void;
  setYears: () => void;
  generateImage: () => Promise<string>;
  setGeneratedImage: (image: string) => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  validActivities: [],
  filteredActivities: [],
  activityTypes: [],
  validActivityTypes: [],
  years: [],
  generatedImage: "/assets/images/demoImage.jpg", // Default placeholder

  setActivities: (activities) => {
    set({ activities });
    get().setValidActivities(); // Filter out activities without polylines
    get().setActivityTypes();
    get().setValidActivityTypes();
    get().setYears();
    get().setFilteredActivities(); // Filter based on current controls selection
    get().generateImage(); // Regenerate image when new activities are set
  },

  setValidActivities: () => {
    const { activities } = get();
    const validActivities = activities.filter(
      (activity) =>
        activity?.map?.summary_polyline &&
        activity.map.summary_polyline.length > 0
    );
    set({ validActivities });
    useControlsStore.getState().setSelectedActivities(validActivities);
  },

  setFilteredActivities: () => {
    const { validActivities } = get();
    const { selectedActivityTypes, selectedDateRange, selectedActivities } =
      useControlsStore.getState();

    if (!selectedDateRange) {
      set({ filteredActivities: [] });
      return;
    }

    const filteredActivities = validActivities.filter((activity) => {
      const activityDate = new Date(activity.start_date_local);
      let inDateRange = true;
      if (selectedDateRange?.from) {
        const fromDate = new Date(selectedDateRange.from);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = selectedDateRange.to
          ? new Date(selectedDateRange.to)
          : new Date(selectedDateRange.from);
        toDate.setHours(23, 59, 59, 999);

        inDateRange = activityDate >= fromDate && activityDate <= toDate;
      }

      const isTypeMatch = selectedActivityTypes.some(
        (type) =>
          type.type === activity.type || type.type === activity.sport_type
      );

      // Determine whether the current activity passes the activity-selection filter:
      // 1. If no activities are selected (array length === 0) -> nothing should pass.
      // 2. If all activities are selected (array length === validActivities.length) -> everything passes.
      // 3. Otherwise only explicitly selected activities pass.

      let isActivitySelected = true;
      if (selectedActivities.length === 0) {
        isActivitySelected = false;
      } else if (selectedActivities.length !== validActivities.length) {
        isActivitySelected = selectedActivities.includes(activity);
      }

      return isTypeMatch && inDateRange && isActivitySelected;
    });
    set({ filteredActivities });
  },

  setActivityTypes: () => {
    const { activities } = get();
    const activityTypes = Array.from(
      new Set(activities.map((activity) => activity.type))
    ).map((type) => ({
      type: type,
      label:
        activityTypeDefinitions.find((definition) => definition.type === type)
          ?.label || type,
      icon: activityTypeDefinitions.find(
        (definition) => definition.type === type
      )?.icon || <ActivityIcon className="text-white" style={{ scale: 1.2 }} />,
    }));
    set({ activityTypes });
  },

  setValidActivityTypes: () => {
    const { activityTypes, validActivities } = get(); // TODO: Maybe update from validActivities to filteredActivities to not show unavailable ones

    const validActivityTypes = activityTypes.filter((activityType) =>
      validActivities.some((activity) => activityType.type === activity.type)
    );
    set({ validActivityTypes });
    useControlsStore.getState().setSelectedActivityTypes(validActivityTypes);
  },

  setYears: () => {
    const { validActivities } = get();
    const years = Array.from(
      new Set(
        validActivities.map((activity) =>
          new Date(activity.start_date_local).getFullYear()
        )
      )
    ).sort((a, b) => b - a);
    set({ years: years });

    if (years.length > 0) {
      const latestYear = years[0];
      useControlsStore.getState().setSelectedDateRange({
        from: new Date(latestYear, 0, 1),
        to: new Date(latestYear, 11, 31),
      });
      useControlsStore.getState().toggleYear(latestYear);
    }
  },

  generateImage: async () => {
    try {
      const newImage = await createImage();
      set({ generatedImage: newImage });
      return newImage;
    } catch (error) {
      console.error("Error generating image:", error);
      return get().generatedImage; // Return current image on error
    }
  },

  setGeneratedImage: (image) => set({ generatedImage: image }),
}));

// Subscribe to controlsStore to regenerate image on mugColor, strokeColor, or selectedActivityTypes change
useControlsStore.subscribe((state, prevState) => {
  const mugColorChanged = state.mugColor !== prevState.mugColor;
  const strokeColorChanged = state.strokeColor !== prevState.strokeColor;
  const activityTypesChanged = !isEqual(
    state.selectedActivityTypes,
    prevState.selectedActivityTypes
  );
  const activitiesChanged = !isEqual(
    state.selectedActivities,
    prevState.selectedActivities
  );
  const dateRangeChanged = !isEqual(
    state.selectedDateRange,
    prevState.selectedDateRange
  );

  if (
    mugColorChanged ||
    strokeColorChanged ||
    activityTypesChanged ||
    activitiesChanged ||
    dateRangeChanged
  ) {
    if (activityTypesChanged || activitiesChanged || dateRangeChanged) {
      // If filters changed, update the filtered activities first
      useActivityStore.getState().setFilteredActivities();
    }
    // Then, regenerate the image (which will use the latest filteredActivities)
    useActivityStore.getState().generateImage();
  }
});
