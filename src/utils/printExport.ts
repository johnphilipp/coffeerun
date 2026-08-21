import { DEFAULT_PRINT_SPEC, PrintSpec } from "@/config/printSpec";
import { createPrintCanvas } from "@/utils/imageUtils";
import { saveAs } from "file-saver";

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob returned null"))),
      "image/png"
    );
  });
}

// Standard PNG CRC-32 over chunk type + data.
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Stamps a pHYs chunk so viewers read the intended DPI instead of assuming 96.
 * Canvas.toBlob writes no physical-size metadata, and Gelato's editor can flag
 * a correctly-sized file as low-resolution without it. The pixel dimensions are
 * what actually drive the print; this is belt-and-braces.
 *
 * pHYs must precede IDAT; inserting right after IHDR (the fixed first chunk,
 * bytes 8..33) satisfies that.
 */
function stampDpi(pngBytes: Uint8Array, dpi: number): Uint8Array {
  const perMetre = Math.round(dpi / 0.0254);

  const chunk = new Uint8Array(4 + 4 + 9 + 4);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, 9); // data length
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  view.setUint32(8, perMetre); // x px/metre
  view.setUint32(12, perMetre); // y px/metre
  chunk[16] = 1; // unit = metre
  view.setUint32(17, crc32(chunk.subarray(4, 17)));

  const IHDR_END = 33;
  const out = new Uint8Array(pngBytes.length + chunk.length);
  out.set(pngBytes.subarray(0, IHDR_END), 0);
  out.set(chunk, IHDR_END);
  out.set(pngBytes.subarray(IHDR_END), IHDR_END + chunk.length);
  return out;
}

/**
 * Renders the current design at the print spec's resolution and saves it as a
 * PNG. The file is generated entirely client-side from the user's own design —
 * nothing is uploaded.
 */
export async function downloadPrintFile(
  spec: PrintSpec = DEFAULT_PRINT_SPEC
): Promise<void> {
  const canvas = createPrintCanvas(spec);
  const blob = await canvasToPngBlob(canvas);
  const stamped = stampDpi(new Uint8Array(await blob.arrayBuffer()), spec.dpi);

  saveAs(
    new Blob([stamped], { type: "image/png" }),
    `coffeerun-print-${spec.widthPx}x${spec.heightPx}.png`
  );
}
