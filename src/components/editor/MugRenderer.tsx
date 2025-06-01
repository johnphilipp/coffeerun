"use client";

import Mug from "@/components/editor/Mug";
import {
  ContactShadows,
  Environment,
  PresentationControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

export default function MugRenderer() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 100, position: [0, 4, 12] }}
      gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
      style={{
        touchAction: "none",
        background:
          "radial-gradient(circle at 50% 60%, #3a3a3a 0%, #0d0d0d 100%)",
      }}
    >
      <Environment preset="forest" />

      <PresentationControls
        global
        snap
        rotation={[0, 0.2, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <Mug />
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
