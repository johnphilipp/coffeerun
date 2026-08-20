"use client";

import Editor from "@/components/editor/Editor";
import GpxDropzone from "@/components/import/GpxDropzone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLibrarySeed } from "@/hooks/useLibrarySeed";
import { useState } from "react";

export default function ImportPage() {
  const { count } = useLibrarySeed();
  // Adding files is the whole point of this route, so the picker is open on
  // arrival whether or not rides already exist. Dismissing it reveals the mug;
  // /editor is the route for going straight there.
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="h-full w-full">
      <Editor />

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
