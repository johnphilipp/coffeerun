/**
 * Converts a hex color string to RGB values
 */
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Checks if two colors are too similar based on RGB distance
 */
export const areColorsTooSimilar = (
  color1: string,
  color2: string
): boolean => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return false;

  // Calculate color difference using a simple Euclidean distance
  const diff = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );

  // If the difference is less than 100, consider them too similar
  return diff < 100;
};

/**
 * Returns a contrasting color (black or white) based on the input color's luminance
 */
export const getContrastingColor = (color: string): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return "#ffffff";

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // Return black for light colors and white for dark colors
  return luminance > 0.5 ? "#000000" : "#ffffff";
};
