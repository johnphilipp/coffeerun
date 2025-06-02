import { useActivityStore } from "@/store/activityStore";
import { useControlsStore } from "@/store/controlsStore";
import polyline from "@mapbox/polyline";

/**
 * Create an image from the activities and controls
 * @returns The image as a base64 string
 */
export const createImage = async (): Promise<string> => {
  const { filteredActivities } = useActivityStore.getState();
  const { mugColor, strokeColor } = useControlsStore.getState();

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.fillStyle = mugColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Define region for the image
  const regionX = 480;
  const regionY = 1450;
  const regionWidth = 1300;
  const regionHeight = 500;

  const { cellMargin, strokeWidth } = getProperties(filteredActivities.length);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeColor;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Calculate grid dimensions
  const { rows, cols } = calculateGridDimensions(
    filteredActivities.length,
    regionWidth,
    regionHeight
  );
  const boxHeight = regionHeight / rows;

  // Draw the activities
  filteredActivities.forEach((activity, index) => {
    const coords = getQuadrantCoordinates(
      activity.map.summary_polyline,
      index,
      cellMargin,
      cols,
      regionWidth,
      boxHeight
    );
    if (!coords || coords.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(coords[0][0] + regionX, coords[0][1] + regionY);
    for (let i = 1; i < coords.length; i++) {
      const [x, y] = coords[i];
      ctx.lineTo(x + regionX, y + regionY);
    }
    ctx.stroke();
  });

  // Convert canvas to image
  const image = canvas.toDataURL("image/png");

  // Return the image
  return image;
};

/**
 * Get the properties for the image
 * @param n - The number of activities
 * @returns The properties for the image
 */
function getProperties(n: number) {
  return (function () {
    if (n <= 25) {
      return { cellMargin: 12, strokeWidth: 12 };
    } else if (n <= 50) {
      return { cellMargin: 10, strokeWidth: 10 };
    } else if (n <= 100) {
      return { cellMargin: 8, strokeWidth: 8 };
    } else if (n <= 200) {
      return { cellMargin: 6, strokeWidth: 6 };
    } else if (n <= 400) {
      return { cellMargin: 5, strokeWidth: 5 };
    } else if (n <= 600) {
      return { cellMargin: 4, strokeWidth: 4 };
    } else {
      return { cellMargin: 3, strokeWidth: 3 };
    }
  })();
}

/**
 * Calculate the grid dimensions for the image
 * @param numActivities - The number of activities
 * @param width - The width of the image
 * @param height - The height of the image
 * @returns The grid dimensions
 */
function calculateGridDimensions(
  numActivities: number,
  width: number,
  height: number
) {
  let bestLayout = {
    rows: 1,
    cols: numActivities,
    aspectDiff: Number.MAX_VALUE,
  };

  for (let cols = 1; cols <= numActivities; cols++) {
    const rows = Math.ceil(numActivities / cols);
    const boxWidth = width / cols;
    const boxHeight = height / rows;

    // Aspect difference favors more square-like layouts
    const aspectDiff = Math.abs(boxWidth / boxHeight - 1);

    // Update the best layout if this layout has a more square-like aspect ratio
    if (aspectDiff < bestLayout.aspectDiff) {
      bestLayout = { rows, cols, aspectDiff };
    }
  }

  return bestLayout;
}

/**
 * Get the quadrant coordinates for the image
 * @param polylineData - The polyline data
 * @param index - The index of the activity
 * @param CELL_MARGIN - The margin of the cell
 * @param cols - The number of columns
 * @param SVG_WIDTH - The width of the image
 * @param SVG_HEIGHT - The height of the image
 * @returns The quadrant coordinates
 */
function getQuadrantCoordinates(
  polylineData: string,
  index: number,
  CELL_MARGIN: number,
  cols: number,
  SVG_WIDTH: number,
  SVG_HEIGHT: number
) {
  const coordinates = decodePolyline(polylineData);
  const scaledCoordinates = scaleCoordinates(
    coordinates,
    CELL_MARGIN,
    cols,
    SVG_WIDTH,
    SVG_HEIGHT
  );

  const [minX, maxX, minY, maxY] = findBoundingBox(
    scaledCoordinates as [number, number][]
  );

  const row = Math.floor(index / cols);
  const col = index % cols;

  const quadrantWidth = SVG_WIDTH / cols;
  const quadrantHeight = SVG_HEIGHT;

  const offsetX = col * quadrantWidth;
  const offsetY = row * quadrantHeight;

  const pathCenterX = (minX + maxX) / 2;
  const pathCenterY = (minY + maxY) / 2;

  const quadrantCenterX = offsetX + quadrantWidth / 2;
  const quadrantCenterY = offsetY + quadrantHeight / 2;

  const translateX = quadrantCenterX - pathCenterX;
  const translateY = quadrantCenterY - pathCenterY;

  return scaledCoordinates.map((coord) => [
    coord[0] + translateX,
    coord[1] + translateY,
  ]);
}

/**
 * Decode the polyline data
 * @param data - The polyline data
 * @returns The decoded polyline
 */
export function decodePolyline(data: string) {
  return polyline.decode(data);
}

/**
 * Scale the coordinates for the image
 * @param coordinates - The coordinates to scale
 * @param margin - The margin of the cell
 * @param cols - The number of columns
 * @param SVG_WIDTH - The width of the image
 * @param SVG_HEIGHT - The height of the image
 * @returns The scaled coordinates
 */
function scaleCoordinates(
  coordinates: [number, number][],
  margin: number,
  cols: number,
  SVG_WIDTH: number,
  SVG_HEIGHT: number
) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity,
    sumLat = 0;

  for (const [latitude, longitude] of coordinates) {
    sumLat += latitude;
    if (longitude < minX) minX = longitude;
    if (latitude < minY) minY = latitude;
    if (longitude > maxX) maxX = longitude;
    if (latitude > maxY) maxY = latitude;
  }

  const quadrantWidth = SVG_WIDTH / cols;
  const quadrantHeight = SVG_HEIGHT;

  const avgLat = sumLat / coordinates.length;
  const latCorrection = Math.cos((avgLat * Math.PI) / 180);

  const xRange = (maxX - minX) * latCorrection;
  const yRange = maxY - minY;

  const adjustedQuadrantWidth = quadrantWidth - 2 * margin;
  const adjustedQuadrantHeight = quadrantHeight - 2 * margin;

  const xScale = adjustedQuadrantWidth / xRange;
  const yScale = adjustedQuadrantHeight / yRange;
  const scale = Math.min(xScale, yScale);

  return coordinates.map((coord) => [
    (coord[1] - minX) * latCorrection * scale,
    adjustedQuadrantHeight - (coord[0] - minY) * scale, // Adjust the y-coordinate scaling
  ]);
}

/**
 * Find the bounding box for the image
 * @param coordinates - The coordinates to find the bounding box for
 * @returns The bounding box
 */
function findBoundingBox(coordinates: [number, number][]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const [x, y] of coordinates) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  return [minX, maxX, minY, maxY];
}
