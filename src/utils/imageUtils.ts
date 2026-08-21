import { useActivityStore } from "@/store/activityStore";
import { useControlsStore } from "@/store/controlsStore";
import { DEFAULT_PRINT_SPEC, PrintSpec } from "@/config/printSpec";
import { Activity } from "@/types/activity";
import polyline from "@mapbox/polyline";

// The mug is always white now (Gelato prints on a white substrate; see the
// print-export work). Kept as a named constant so the texture and the print
// export can't drift on it.
const MUG_BACKGROUND = "#ffffff";

// The printable wrap is 213mm wide (Gelato 15oz). Both the 3D texture and the
// print file map their design region onto that same physical width, so
// stroke widths expressed in mm come out the same physical size in each.
const PRINTABLE_WIDTH_MM = DEFAULT_PRINT_SPEC.widthMm;

// The 3D texture's design region, hand-tuned to the caneca.glb wrap. Its aspect
// (2.6:1) differs from the print area (~2.07:1), so the two share the grid
// arrangement (same route in the same cell) and stroke sizing, but a cell's
// proportions differ slightly between preview and print — an approximation;
// an exact match would mean retuning this band on the model.
const TEXTURE = {
  canvas: 2048,
  region: { x: 480, y: 1450, width: 1300, height: 500 },
};

interface RenderSpec {
  canvasWidth: number;
  canvasHeight: number;
  region: { x: number; y: number; width: number; height: number };
  background: string;
  stroke: string;
  /** Canvas pixels per millimetre of printable width — sizes the strokes. */
  pxPerMm: number;
  /** Aspect the grid is packed for; shared so preview and print match. */
  gridAspect: { w: number; h: number };
  activities: Activity[];
}

/**
 * Stroke and cell margin in millimetres, by activity count.
 *
 * Was absolute pixels tuned for the 2048 texture; in mm it stays physically
 * consistent across the preview and the print. The 1.2mm floor exists because
 * Gelato warns that fine tints fade on ceramic — dense mugs used to drop to
 * ~0.5mm lines that wouldn't reproduce.
 */
const MIN_STROKE_MM = 1.2;

function getDesignMetricsMm(n: number): {
  strokeMm: number;
  marginMm: number;
} {
  const raw =
    n <= 25
      ? { strokeMm: 2.0, marginMm: 2.0 }
      : n <= 50
      ? { strokeMm: 1.65, marginMm: 1.65 }
      : n <= 100
      ? { strokeMm: 1.3, marginMm: 1.3 }
      : n <= 200
      ? { strokeMm: 1.0, marginMm: 1.0 }
      : n <= 400
      ? { strokeMm: 0.8, marginMm: 0.8 }
      : n <= 600
      ? { strokeMm: 0.66, marginMm: 0.66 }
      : { strokeMm: 0.49, marginMm: 0.49 };

  const strokeMm = Math.max(raw.strokeMm, MIN_STROKE_MM);
  // Keep the inter-cell gap at least as wide as a stroke's half-width, or a
  // floored stroke on a dense mug spills past its cell into the neighbour and
  // adjacent routes merge into a blob.
  const marginMm = Math.max(raw.marginMm, strokeMm / 2);
  return { strokeMm, marginMm };
}

// Grid arrangement is computed against the print area's aspect so a given route
// lands in the same cell in the preview and the print. Each target draws that
// arrangement into its own region. The aspect is threaded through the spec so a
// non-default print size lays its grid out correctly, rather than always using
// the default.
function designGrid(n: number, aspectW: number, aspectH: number) {
  return calculateGridDimensions(n, aspectW, aspectH);
}

/** Draws the routes onto a fresh canvas per the spec and returns it. */
function renderDesign(spec: RenderSpec): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = spec.canvasWidth;
  canvas.height = spec.canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.fillStyle = spec.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const n = spec.activities.length;
  const { strokeMm, marginMm } = getDesignMetricsMm(n);
  const strokeWidth = strokeMm * spec.pxPerMm;
  const cellMargin = marginMm * spec.pxPerMm;

  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = spec.stroke;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const { rows, cols } = designGrid(n, spec.gridAspect.w, spec.gridAspect.h);
  const boxHeight = spec.region.height / rows;

  spec.activities.forEach((activity, index) => {
    const coords = getQuadrantCoordinates(
      activity.map.summary_polyline,
      index,
      cellMargin,
      cols,
      spec.region.width,
      boxHeight
    );
    if (!coords || coords.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(coords[0][0] + spec.region.x, coords[0][1] + spec.region.y);
    for (let i = 1; i < coords.length; i++) {
      const [x, y] = coords[i];
      ctx.lineTo(x + spec.region.x, y + spec.region.y);
    }
    ctx.stroke();
  });

  return canvas;
}

/**
 * The image mapped onto the 3D mug. Same as the old createImage output, but the
 * background is now fixed white rather than a mug-color picker.
 * @returns The image as a base64 data URL.
 */
export const createImage = async (): Promise<string> => {
  const { filteredActivities } = useActivityStore.getState();
  const { strokeColor } = useControlsStore.getState();

  const canvas = renderDesign({
    canvasWidth: TEXTURE.canvas,
    canvasHeight: TEXTURE.canvas,
    region: TEXTURE.region,
    background: MUG_BACKGROUND,
    stroke: strokeColor,
    pxPerMm: TEXTURE.region.width / PRINTABLE_WIDTH_MM,
    // Grid packed for the print aspect so the preview matches the print target.
    gridAspect: { w: DEFAULT_PRINT_SPEC.widthMm, h: DEFAULT_PRINT_SPEC.heightMm },
    activities: filteredActivities,
  });

  return canvas.toDataURL("image/png");
};

/**
 * The flat print file for a physical mug — full printable area, white
 * background, routes inset by the spec's safe margin.
 */
export function createPrintCanvas(
  spec: PrintSpec = DEFAULT_PRINT_SPEC
): HTMLCanvasElement {
  const { filteredActivities } = useActivityStore.getState();
  const { strokeColor } = useControlsStore.getState();

  const marginPx = (spec.safeMarginMm / 25.4) * spec.dpi;

  return renderDesign({
    canvasWidth: spec.widthPx,
    canvasHeight: spec.heightPx,
    region: {
      x: marginPx,
      y: marginPx,
      width: spec.widthPx - 2 * marginPx,
      height: spec.heightPx - 2 * marginPx,
    },
    background: MUG_BACKGROUND,
    stroke: strokeColor,
    pxPerMm: spec.widthPx / spec.widthMm,
    // This spec's own aspect, so a non-default size packs its grid correctly.
    gridAspect: { w: spec.widthMm, h: spec.heightMm },
    activities: filteredActivities,
  });
}

/**
 * Get the grid dimensions for the image
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
