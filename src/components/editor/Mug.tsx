"use client";

import { useActivityStore } from "@/store/activityStore";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Mug() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { generatedImage } = useActivityStore();

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
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.5;
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
