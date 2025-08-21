"use client";

import { useActivityStore } from "@/store/activityStore";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useControlsStore } from "@/store/controlsStore";

export default function Mug() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { generatedImage } = useActivityStore();
  const isRotationPaused = useControlsStore((state) => state.isRotationPaused);
  const rotationSpeedRef = useRef<number>(0.5);

  const { nodes, materials } = useGLTF("/assets/model/caneca.glb");

  const roughnessTexture = useTexture(
    "/assets/textures/roughness.png",
    (tex) => {
      tex.flipY = false;
    }
  );

  const loadedTexture = useTexture(generatedImage, (tex) => {
    tex.flipY = false;
  });

  useFrame((state, delta) => {
    const targetSpeed = isRotationPaused ? 0 : 0.5;
    rotationSpeedRef.current = THREE.MathUtils.damp(
      rotationSpeedRef.current,
      targetSpeed,
      6,
      delta
    );

    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * rotationSpeedRef.current;
    }
  });

  return (
    <group dispose={null}>
      <mesh
        ref={meshRef}
        rotation={[0, Math.PI * 1.2, 0]}
        geometry={(nodes.Mug as THREE.Mesh).geometry}
        material={materials.Material}
        material-map={loadedTexture}
        material-roughness={1}
        material-roughnessMap={roughnessTexture}
      />
    </group>
  );
}
