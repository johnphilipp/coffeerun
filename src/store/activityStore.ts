import { create } from "zustand";
import { Activity } from "@/types/activity";
import { createImage } from "@/utils/createImage";
import { useControlsStore } from "./controlsStore";

interface ActivityState {
  activities: Activity[];
  filteredActivities: Activity[];
  generatedImage: string;
  isGenerating: boolean;
  setActivities: (activities: Activity[]) => void;
  setFilteredActivities: (activities: Activity[]) => void;
  generateImage: () => Promise<string>;
  setGeneratedImage: (image: string) => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  filteredActivities: [],
  generatedImage: "/assets/images/demoImage.jpg", // Default placeholder
  isGenerating: false,

  setActivities: (activities) => {
    set({ activities });
    // Trigger image generation when activities change
    get().generateImage();
  },

  setFilteredActivities: (filteredActivities) => {
    set({ filteredActivities });
    // Trigger image generation when filtered activities change
    get().generateImage();
  },

  generateImage: async () => {
    const { activities } = get();
    const { mugColor } = useControlsStore.getState();

    set({ isGenerating: true });

    try {
      const newImage = await createImage(activities, mugColor);
      set({ generatedImage: newImage, isGenerating: false });
      return newImage;
    } catch (error) {
      console.error("Error generating image:", error);
      set({ isGenerating: false });
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
