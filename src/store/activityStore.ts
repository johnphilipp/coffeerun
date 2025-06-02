import { useControlsStore } from "@/store/controlsStore";
import { Activity } from "@/types/activity";
import { createImage } from "@/utils/imageUtils";
import { create } from "zustand";

interface ActivityState {
  activities: Activity[];
  validActivities: Activity[];
  filteredActivities: Activity[];
  generatedImage: string;
  setActivities: (activities: Activity[]) => void;
  validateActivities: () => void;
  filterActivities: () => void;
  generateImage: () => Promise<string>;
  setGeneratedImage: (image: string) => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  validActivities: [],
  filteredActivities: [],
  generatedImage: "/assets/images/demoImage.jpg", // Default placeholder

  setActivities: (activities) => {
    set({ activities });
    get().validateActivities(); // Filter out activities without polylines
    get().filterActivities(); // Filter based on current controls selection
    get().generateImage(); // Regenerate image when new activities are set
  },

  validateActivities: () => {
    const { activities } = get();
    const validActivities = activities.filter(
      (activity) =>
        activity?.map?.summary_polyline &&
        activity.map.summary_polyline.length > 0
    );
    set({ validActivities });
  },

  filterActivities: () => {
    const { validActivities } = get();
    const { selectedActivityTypes } = useControlsStore.getState();
    const filteredActivities = validActivities.filter((activity) =>
      selectedActivityTypes.includes(activity.type || activity.sport_type)
    );
    set({ filteredActivities });
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
  const activityTypesChanged =
    JSON.stringify(state.selectedActivityTypes) !==
    JSON.stringify(prevState.selectedActivityTypes);

  if (mugColorChanged || strokeColorChanged || activityTypesChanged) {
    if (activityTypesChanged) {
      // If activity types changed, filter activities first
      useActivityStore.getState().filterActivities();
    }
    // Then, generate the image (which will use the latest filteredActivities)
    useActivityStore.getState().generateImage();
  }
});
