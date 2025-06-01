import { create } from "zustand";
import { Activity } from "@/types/activity";

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

// Placeholder image generation function
const generateImageFromActivities = async (
  activities: Activity[]
): Promise<string> => {
  // For now, just return the placeholder image path
  // In the future, this could make an API call to generate an image based on activities
  console.log(
    "Generating image from activities:",
    activities.length,
    "activities"
  );

  // Simulate some async work
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return the placeholder image path (same as used in Mug.tsx)
  return "/assets/images/demoImage.jpg";
};

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

    set({ isGenerating: true });

    try {
      const newImage = await generateImageFromActivities(activities);
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
