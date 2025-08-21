"use client";

import Scene from "@/components/editor/Scene";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCartStore } from "@/store/cartStore";
import { MinusIcon, PlusIcon, TrashIcon, X } from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getTotalItems,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <Drawer open={isDrawerOpen} onOpenChange={closeDrawer}>
      <DrawerContent className="bg-popover backdrop-blur-xl mx-auto w-full max-w-2xl">
        <DrawerHeader className="flex flex-row items-center justify-between gap-2 p-4">
          <DrawerTitle className="text-white text-xl px-2 whitespace-nowrap">
            Your Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </DrawerTitle>
          <DrawerClose asChild>
            <button className="text-white/90 hover:text-white shrink-0">
              <X />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-4 pb-4 max-h-[70vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/80">Your cart is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Show 3D preview of the mug */}
              <div className="w-full h-64 md:h-48 md:w-48 col-span-1 rounded-xl bg-white/5 ring-1 ring-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                <Scene />
              </div>

              {/* Cart items list */}
              <div className="w-full space-y-3 md:space-y-4 col-span-1 md:col-span-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/10 ring-1 ring-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-white"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      {item.price && (
                        <p className="text-white/70">
                          ${item.price.toFixed(2)} each
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Quantity controls */}
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 rounded-md hover:bg-white/15 transition-colors text-white"
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon size={16} />
                      </button>

                      <span className="mx-2 min-w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 rounded-md hover:bg-white/15 transition-colors text-white"
                      >
                        <PlusIcon size={16} />
                      </button>

                      {/* Remove item */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 ml-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total price */}
              {/* Spacer to avoid content hidden behind footer */}
              <div className="h-2 md:h-0" />
            </div>
          )}
        </div>

        {totalPrice > 0 && (
          <DrawerFooter className="sticky bottom-0 bg-white/10 ring-1 ring-white/10">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-white/80">Subtotal</span>
              <span className="font-semibold text-lg text-white">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button className="bg-white text-gray-900 rounded-md px-4 py-2 hover:bg-white/90 font-semibold">
                Checkout
              </button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
