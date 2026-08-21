"use client";

import { Button } from "@/components/ui/button";
import { useLibraryStore } from "@/store/libraryStore";
import { Activity } from "@/types/activity";
import { parseGpx } from "@/utils/gpx";
import { Trash2Icon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface GpxDropzoneProps {
  onImported?: () => void;
}

export default function GpxDropzone({ onImported }: GpxDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const addActivities = useLibraryStore((state) => state.addActivities);
  const clear = useLibraryStore((state) => state.clear);
  const count = useLibraryStore((state) => state.importedActivities.length);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsParsing(true);
    const parsed: Activity[] = [];
    const failures: string[] = [];

    try {
      for (const file of Array.from(files)) {
        try {
          parsed.push(
            ...parseGpx(await file.text(), file.name, file.lastModified)
          );
        } catch (error) {
          failures.push(error instanceof Error ? error.message : file.name);
        }
      }

      for (const failure of failures) toast.error(failure);
      if (parsed.length === 0) return;

      let added: number;
      try {
        // useLibrarySeed picks the new rides up from the library and pushes the
        // whole set into the activity store, so previously imported rides stay
        // on the mug.
        added = addActivities(parsed);
      } catch (error) {
        // zustand's persist writes to localStorage synchronously inside `set`,
        // so a QuotaExceededError surfaces here — after the rides are already
        // in memory. Keeping them means this mug is still finishable; saying so
        // means the user isn't surprised when they vanish on reload.
        //
        // Only claim it's a quota problem when it actually is. Blaming every
        // throw on full storage sent people deleting rides to free space that
        // was never the issue, and swallowing the error left nothing in the
        // console to correct it.
        const isQuota =
          error instanceof DOMException &&
          (error.name === "QuotaExceededError" ||
            error.name === "NS_ERROR_DOM_QUOTA_REACHED");

        console.error("Failed to save imported rides:", error);
        toast.error(
          isQuota
            ? "Storage is full — these rides are loaded but won't be saved. Remove some rides, or import fewer files."
            : "These rides are loaded but couldn't be saved, so they'll be gone on reload."
        );
        onImported?.();
        return;
      }

      const skipped = parsed.length - added;
      if (added === 0) {
        toast.info(
          `Already in your library — nothing new in ${
            files.length === 1 ? "that file" : "those files"
          }`
        );
        // Deliberately no onImported() here: dismissing the picker on a pure
        // no-op drops the user on an unchanged mug with no way back.
        return;
      }

      toast.success(
        `Imported ${added} ${added === 1 ? "activity" : "activities"}` +
          (skipped > 0 ? ` — ${skipped} already in your library` : "")
      );
      onImported?.();
    } finally {
      // Runs even if a parse or a write threw, so the button can't stick on
      // "Reading files…" with no way to retry.
      setIsParsing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleClear = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      return;
    }
    setConfirmingClear(false);
    try {
      // Persisted write, so it can throw on a zero-quota profile.
      clear();
      toast.success("Removed all rides");
    } catch (error) {
      console.error("Failed to clear rides:", error);
      toast.error("Couldn't remove the saved rides — this browser blocked the write.");
    }
  };

  return (
    // Without these handlers the browser's default drop behavior wins: the tab
    // navigates to the file:// URL, unmounting the editor and losing the mug in
    // progress. A component called "Dropzone" invites the gesture, so it has to
    // handle it.
    <div
      className={`space-y-3 rounded-md transition-colors ${
        isDragging ? "outline outline-2 outline-offset-4 outline-white/40" : ""
      }`}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        // Ignore bubbling from children, or the highlight flickers.
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsDragging(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        // Gated like the picker button is. Without this a second drop mid-parse
        // started a concurrent run whose finally block re-enabled the UI and
        // closed the dialog while the first batch was still reading.
        if (isParsing) return;
        handleFiles(event.dataTransfer.files);
      }}
    >
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
        {isParsing
          ? "Reading files…"
          : isDragging
          ? "Drop to import"
          : "Choose .gpx files"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Or drag them here. Nothing is uploaded — files are read in your browser
        and stay on this device.
      </p>

      {count > 0 && (
        // Two-click confirm rather than window.confirm: native modals block
        // the browser automation this is verified with.
        <Button
          type="button"
          variant={confirmingClear ? "destructive" : "ghost"}
          size="sm"
          className="w-full"
          onClick={handleClear}
          onBlur={() => setConfirmingClear(false)}
        >
          <Trash2Icon />
          {confirmingClear
            ? `Really remove all ${count}?`
            : "Remove all rides"}
        </Button>
      )}
    </div>
  );
}
