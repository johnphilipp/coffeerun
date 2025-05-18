"use client";

import Mug from "@/components/editor/Mug";
import {
  ContactShadows,
  Environment,
  PresentationControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function MugRenderer() {
  return (
    <Canvas camera={{ position: [5, 7, 15] }} style={{ touchAction: "none" }}>
      <ambientLight intensity={0.3} />
      <spotLight
        position={[10, 15, 10]}
        intensity={1.2}
        angle={0.3}
        penumbra={0.8}
      />
      <spotLight
        position={[-10, 15, 10]}
        intensity={0.8}
        angle={0.3}
        penumbra={0.8}
      />
      <Environment files="/assets/hdr/potsdamer_platz_1k.hdr" />
      <PresentationControls
        global
        snap={true}
        rotation={[0, 0.2, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <Mug />
      </PresentationControls>
      <ContactShadows
        position={[0, -7.5, 0]}
        opacity={0.55}
        width={10}
        height={10}
        blur={2.5}
        far={20}
      />
    </Canvas>
  );
}
