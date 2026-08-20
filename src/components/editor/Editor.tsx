"use client";

import AddToCartButton from "@/components/editor/AddToCartButton";
import CartDrawer from "@/components/editor/CartDrawer";
import Controls from "@/components/editor/controls/Controls";
import Scene from "@/components/editor/Scene";
import PauseButton from "./PauseButton";
import { useActivityStore } from "@/store/activityStore";
import { Activity } from "@/types/activity";
import { useEffect } from "react";

interface EditorProps {
  /**
   * Seeds the activity store. Omit it to render whatever the store already
   * holds — that's how /editor shows rides restored from localStorage.
   */
  activities?: Activity[];
}

export default function Editor({ activities }: EditorProps) {
  const setActivities = useActivityStore((state) => state.setActivities);

  useEffect(() => {
    if (activities) setActivities(activities);
  }, [activities, setActivities]);

  return (
    <div className="h-full flex flex-col">
      <AddToCartButton />
      <PauseButton />
      <Scene />
      <Controls />
      <CartDrawer />
    </div>
  );
}
