"use client";

import { useControlsStore } from "@/store/controlsStore";

export default function DynamicBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const mugColor = useControlsStore((state) => state.mugColor);

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        background: `radial-gradient(circle at 50% 60%, ${mugColor}cc -20%, #0d0d0d 120%)`,
      }}
    >
      {children}
    </div>
  );
}
