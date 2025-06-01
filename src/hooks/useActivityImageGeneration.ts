import { useEffect } from "react";
import { useActivityStore } from "@/store/activityStore";
import { Activity } from "@/types/activity";

export const useActivityImageGeneration = (initialActivities: Activity[]) => {
  const {
    activities,
    setActivities,
    generateImage,
    generatedImage,
    isGenerating,
  } = useActivityStore();

  // Initialize activities on first load
  useEffect(() => {
    if (initialActivities.length > 0 && activities.length === 0) {
      setActivities(initialActivities);
    }
  }, [initialActivities, activities.length, setActivities]);

  // Generate image whenever activities change
  useEffect(() => {
    if (activities.length > 0) {
      generateImage();
    }
  }, [activities, generateImage]);

  return {
    activities,
    generatedImage,
    isGenerating,
    setActivities,
  };
};
