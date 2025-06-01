"use client";

import Mug from "@/components/editor/Mug";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  ContactShadows,
  Environment,
  PresentationControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ShoppingCartDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="h-full -mt-8 flex flex-col items-center justify-center">
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Your Cart</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col items-center py-4">
            <div className="w-64 h-64">
              <Canvas
                camera={{ position: [0, 8, 15] }}
                style={{ width: "100%", height: "100%" }}
              >
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
            </div>
            <div className="mt-4 text-lg font-medium">Trophy Mug</div>
          </div>
          <DrawerFooter>
            <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors">
              Proceed to payment
            </button>
            <DrawerClose asChild>
              <button className="w-full mt-2 border py-2 rounded-md">
                Close
              </button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
        <div className="z-10 relative flex flex-col items-center">
          <button
            className="mt-12 bg-black text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={() => setDrawerOpen(true)}
          >
            <ShoppingCartIcon size={20} />
            Add to cart
          </button>
          <Link
            href="/#"
            className="mt-2 text-gray-500 hover:text-black transition-colors"
          >
            Gift a friend
          </Link>
        </div>
      </Drawer>
    </div>
  );
}
