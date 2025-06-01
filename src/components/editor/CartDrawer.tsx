"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import Scene from "./Scene";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <Drawer open={isDrawerOpen} onOpenChange={closeDrawer}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Your Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col items-center py-4 max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Show 3D preview of the mug */}
              <div className="w-64 h-64 mb-4">
                <Scene />
              </div>

              {/* Cart items list */}
              <div className="w-full max-w-md space-y-4 px-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.price && (
                        <p className="text-gray-600">
                          ${item.price.toFixed(2)} each
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Quantity controls */}
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 rounded-md hover:bg-gray-200 transition-colors"
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
                        className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <PlusIcon size={16} />
                      </button>

                      {/* Remove item */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 ml-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total price */}
              {totalPrice > 0 && (
                <div className="w-full max-w-md px-4 pt-4 border-t">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DrawerFooter>
          {items.length > 0 && (
            <>
              <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium">
                Proceed to Payment (${totalPrice.toFixed(2)})
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-2 text-red-500 hover:text-red-700 py-2 transition-colors"
              >
                Clear Cart
              </button>
            </>
          )}
          <DrawerClose asChild>
            <button className="w-full mt-2 border py-2 rounded-md hover:bg-gray-50 transition-colors">
              Close
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
