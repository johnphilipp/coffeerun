"use client";

import { Gift, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartButton() {
  const { addItem, openDrawer, getTotalItems, items } = useCartStore();
  const totalItems = getTotalItems();
  const hasItems = items.length > 0;

  const handleButtonClick = () => {
    if (hasItems) {
      // If cart has items, just open the drawer to view/manage cart
      openDrawer();
    } else {
      // If cart is empty, add the trophy mug and open drawer
      addItem({
        id: "trophy-mug",
        name: "Trophy Mug",
        price: 29.99,
      });
      openDrawer();
    }
  };

  return (
    <div className="absolute top-12 w-full z-10 flex justify-center">
      <div className="flex flex-col items-center">
        <button
          className="mt-12 bg-white/10 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-white/15 cursor-pointer relative hover:scale-105 transition-all duration-300"
          onClick={handleButtonClick}
        >
          <ShoppingCartIcon size={20} />
          {hasItems ? "View cart" : "Add to cart"}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
        <Link
          href="#"
          className="mt-2 text-white hover:text-gray-300 flex items-center gap-1.5 hover:scale-105 transition-all duration-300"
        >
          Gift a friend
          <Gift size={16} />
        </Link>
      </div>
    </div>
  );
}
