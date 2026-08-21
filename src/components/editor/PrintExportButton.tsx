"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_PRINT_SPEC } from "@/config/printSpec";
import { downloadPrintFile } from "@/utils/printExport";
import { DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Dev-only affordance to pull the print-resolution PNG for eyeballing in
 * Gelato's editor. Gated on `?print=1` so visitors never see it; this exists to
 * validate print output before the payment/fulfilment flow is built.
 *
 * The flag is read after mount rather than via useSearchParams to avoid Next's
 * CSR-bailout/Suspense requirement on this statically-rendered route.
 */
export default function PrintExportButton() {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setEnabled(new URLSearchParams(window.location.search).get("print") === "1");
  }, []);

  if (!enabled) return null;

  const handleDownload = async () => {
    setBusy(true);
    try {
      await downloadPrintFile();
    } catch (error) {
      console.error("Print export failed:", error);
      toast.error("Couldn't generate the print file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute left-6 top-4 z-50"
      disabled={busy}
      onClick={handleDownload}
    >
      <DownloadIcon />
      {busy
        ? "Rendering…"
        : `Print file · ${DEFAULT_PRINT_SPEC.widthPx}×${DEFAULT_PRINT_SPEC.heightPx}`}
    </Button>
  );
}
