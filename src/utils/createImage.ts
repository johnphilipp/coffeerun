import { Activity } from "@/types/activity";

export const createImage = async (
  activities: Activity[],
  mugColor: string
): Promise<string> => {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.fillStyle = mugColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const image = canvas.toDataURL("image/png");

  // Return the placeholder image path (same as used in Mug.tsx)
  return image;
};
