/**
 * Print templates for physical mug fulfilment.
 *
 * Shaped as a keyed map so adding another size or provider later is a config
 * entry, not a code change — the render engine reads whichever spec it's handed.
 *
 * Gelato numbers are from their help center
 * (support.gelato.com/en/articles/8996273): the White 15oz Ceramic Mug has a
 * 213 x 103 mm printable area, is cylindrical (flat art maps 1:1, no morphing),
 * prints sRGB, and wants 300 DPI at final size.
 */
export interface PrintSpec {
  label: string;
  /** Printable area in millimetres. */
  widthMm: number;
  heightMm: number;
  dpi: number;
  /** Inset kept clear of the edges/handle seam, in millimetres. */
  safeMarginMm: number;
  /** Pixel dimensions at `dpi`, derived. */
  widthPx: number;
  heightPx: number;
}

function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm / 25.4) * dpi);
}

function makeSpec(
  s: Omit<PrintSpec, "widthPx" | "heightPx">
): PrintSpec {
  return {
    ...s,
    widthPx: mmToPx(s.widthMm, s.dpi),
    heightPx: mmToPx(s.heightMm, s.dpi),
  };
}

export const PRINT_SPECS = {
  // 213mm x 103mm @ 300 DPI -> 2516 x 1216 px.
  gelatoWhite15oz: makeSpec({
    label: "Gelato White 15oz Ceramic Mug",
    widthMm: 213,
    heightMm: 103,
    dpi: 300,
    safeMarginMm: 3,
  }),
} as const;

export const DEFAULT_PRINT_SPEC = PRINT_SPECS.gelatoWhite15oz;
