"use client";

import Editor from "@/components/editor/Editor";
import GpxDropzone from "@/components/import/GpxDropzone";
import LibraryErrorState from "@/components/LibraryErrorState";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";
import { useLibrarySeed } from "@/hooks/useLibrarySeed";
import { UploadIcon } from "lucide-react";
import { useState } from "react";

export default function ImportPage() {
  const { status, count, reset } = useLibrarySeed();
  // Adding files is the whole point of this route, so the picker is open on
  // arrival whether or not rides already exist. Dismissing it reveals the mug;
  // /editor is the route for going straight there.
  const [isOpen, setIsOpen] = useState(true);

  if (status === "pending") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Must come before the picker: importing here would write over the damaged
  // value and destroy whatever was still recoverable. This route is where the
  // homepage's primary CTA lands, so it needs the recovery path too.
  if (status === "failed") {
    return <LibraryErrorState onReset={reset} />;
  }

  return (
    <div className="h-full w-full">
      <Editor />

      {/* Without this the picker is unreachable once dismissed — which also
          stranded the "remove all rides" action inside it. Occupies the slot
          the signed-in user menu used to hold. */}
      {!isOpen && (
        <Button
          variant="outline"
          size="sm"
          className="absolute right-6 top-4 z-50"
          onClick={() => setIsOpen(true)}
        >
          <UploadIcon />
          Add rides
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-popover backdrop-blur-xl text-white">
          <DialogHeader>
            <DialogTitle>Add your rides</DialogTitle>
            <DialogDescription>
              Export from Strava, Garmin Connect, Komoot or any watch that
              writes GPX. Select as many files as you like — Strava&apos;s bulk
              export ships them zipped, so unzip first.
            </DialogDescription>
          </DialogHeader>

          <GpxDropzone onImported={() => setIsOpen(false)} />

          {count > 0 && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Done — {count} {count === 1 ? "activity" : "activities"} in your
              library
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
