"use client";

import Mug from "@/components/editor/Mug";
import {
  ContactShadows,
  Environment,
  Html,
  PresentationControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import * as THREE from "three";

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 100, position: [0, 4, 12] }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
      style={{
        touchAction: "none",
      }}
    >
      <Environment files="/assets/hdr/forest_slope_1k.hdr" />
      <PresentationControls
        global
        snap
        rotation={[0, 0.2, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <Suspense
          fallback={
            <Html center>
              <Loader2 className="w-10 h-10 animate-spin text-white/80" />
            </Html>
          }
        >
          <Mug />
        </Suspense>
      </PresentationControls>
      <ContactShadows
        position={[0, -7.5, 0]}
        opacity={0.8}
        width={12}
        height={12}
        blur={1}
        far={10}
      />
    </Canvas>
  );
}
