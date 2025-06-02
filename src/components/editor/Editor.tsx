"use client";

import Scene from "@/components/editor/Scene";
import { Activity } from "@/types/activity";
import Controls from "./Controls";
import AddToCartButton from "./AddToCartButton";
import CartDrawer from "./CartDrawer";
import { useActivityImageGeneration } from "@/hooks/useActivityImageGeneration";
import { Loader2 } from "lucide-react";

interface EditorProps {
  activities: Activity[];
}

export default function Editor({ activities }: EditorProps) {
  const { isGenerating } = useActivityImageGeneration(activities);

  if (isGenerating) {
    return (
      <div className="h-screen flex items-center justify-center -mt-12">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 -mt-12">
        <AddToCartButton />
        <Scene />
        <Controls />
        <CartDrawer />
      </div>
    </div>
  );
}
