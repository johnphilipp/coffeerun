"use client";

import AddToCartButton from "@/components/editor/AddToCartButton";
import CartDrawer from "@/components/editor/CartDrawer";
import Controls from "@/components/editor/controls/Controls";
import Scene from "@/components/editor/Scene";
import PauseButton from "./PauseButton";

/**
 * Pure layout. Activities reach the store through useLibrarySeed (imported
 * rides) or useDemoActivities (the demo fixture) — this component no longer
 * takes them as a prop, so there's only one path that writes them.
 */
export default function Editor() {
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
