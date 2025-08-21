"use client";

import { Pause, Play } from "lucide-react";
import { useControlsStore } from "@/store/controlsStore";

export default function PauseButton() {
  const isPaused = useControlsStore((state) => state.isRotationPaused);
  const toggle = useControlsStore((state) => state.toggleRotation);

  return (
    <div className="absolute top-38 w-full z-10 flex justify-center">
      <div className="flex flex-col items-center">
        <button
          className="mt-2 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground py-2 px-4 rounded-md flex items-center gap-2 cursor-pointer relative hover:scale-105 transition-all duration-300"
          onClick={toggle}
          aria-pressed={isPaused}
          aria-label={isPaused ? "Resume rotation" : "Pause rotation"}
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
      </div>
    </div>
  );
}
