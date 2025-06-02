"use client";

import AddToCartButton from "@/components/editor/AddToCartButton";
import CartDrawer from "@/components/editor/CartDrawer";
import Controls from "@/components/editor/Controls";
import Scene from "@/components/editor/Scene";
import { useActivityStore } from "@/store/activityStore";
import { Activity } from "@/types/activity";
import { useEffect } from "react";

interface EditorProps {
  activities: Activity[];
}

export default function Editor({ activities }: EditorProps) {
  const setActivities = useActivityStore((state) => state.setActivities);

  useEffect(() => {
    setActivities(activities);
  }, [activities, setActivities]);

  return (
    <div className="h-full flex flex-col">
      <AddToCartButton />
      <Scene />
      <Controls />
      <CartDrawer />
    </div>
  );
}
