import { useControlsStore } from "@/store/controlsStore";
import { Activity } from "@/types/activity";
import { createImage } from "@/utils/createImage";
import { create } from "zustand";

interface ActivityState {
  activities: Activity[];
  filteredActivities: Activity[];
  generatedImage: string;
  setActivities: (activities: Activity[]) => void;
  setFilteredActivities: (activities: Activity[]) => void;
  generateImage: () => Promise<string>;
  setGeneratedImage: (image: string) => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  filteredActivities: [],
  generatedImage: "/assets/images/demoImage.jpg", // Default placeholder

  setActivities: (activities) => {
    set({ activities });
    get().generateImage();
  },

  setFilteredActivities: (filteredActivities) => {
    set({ filteredActivities });
    get().generateImage();
  },

  generateImage: async () => {
    const { activities } = get();
    const { mugColor } = useControlsStore.getState();

    try {
      const newImage = await createImage(activities, mugColor);
      set({ generatedImage: newImage });
      return newImage;
    } catch (error) {
      console.error("Error generating image:", error);
      return get().generatedImage; // Return current image on error
    }
  },

  setGeneratedImage: (image) => set({ generatedImage: image }),
}));

// Subscribe to controlsStore to regenerate image on mugColor change
useControlsStore.subscribe((state, prevState) => {
  if (state.mugColor !== prevState.mugColor) {
    useActivityStore.getState().generateImage();
  }
});
