"use client";

export default function DynamicBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      // Fixed dark backdrop. Used to be tinted by the mug color; now the mug is
      // white, so it glows against a constant dark page rather than the page
      // changing with it.
      style={{
        background:
          "radial-gradient(circle at 50% 60%, #1a1a1acc -20%, #0d0d0d 160%)",
      }}
    >
      {children}
    </div>
  );
}
