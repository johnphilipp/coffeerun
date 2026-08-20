"use client";

import { Button } from "@/components/ui/button";
import { useLibraryStore } from "@/store/libraryStore";
import { Activity } from "@/types/activity";
import { parseGpx } from "@/utils/gpx";
import { UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface GpxDropzoneProps {
  onImported?: () => void;
}

export default function GpxDropzone({ onImported }: GpxDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const addActivities = useLibraryStore((state) => state.addActivities);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsParsing(true);
    const parsed: Activity[] = [];
    const failures: string[] = [];

    for (const file of Array.from(files)) {
      try {
        parsed.push(...parseGpx(await file.text(), file.name));
      } catch (error) {
        failures.push(error instanceof Error ? error.message : file.name);
      }
    }

    for (const failure of failures) toast.error(failure);

    if (parsed.length > 0) {
      // useLibrarySeed picks the new rides up from the library and pushes the
      // whole set into the activity store, so previously imported rides stay
      // on the mug.
      const added = addActivities(parsed);
      const skipped = parsed.length - added;

      if (added === 0) {
        toast.info(
          `Already in your library — nothing new in ${
            files.length === 1 ? "that file" : "those files"
          }`
        );
      } else {
        toast.success(
          `Imported ${added} ${added === 1 ? "activity" : "activities"}` +
            (skipped > 0 ? ` — ${skipped} already in your library` : "")
        );
      }
      onImported?.();
    }

    setIsParsing(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".gpx"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isParsing}
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon />
        {isParsing ? "Reading files…" : "Choose .gpx files"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Nothing is uploaded — files are read in your browser and stay on this
        device.
      </p>
    </div>
  );
}
