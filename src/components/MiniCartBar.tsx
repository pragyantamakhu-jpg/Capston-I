"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function MiniCartBar() {
  const { cart, subtotal } = useCart();

  if (cart.length === 0) {
    return null;
  }

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="fixed right-0 bottom-0 left-0 z-10 flex items-center justify-between bg-brand-600 px-4 py-3 text-white shadow-lg"
    >
      <span>
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </span>
      <span>Subtotal: ₹{subtotal}</span>
    </Link>
  );
}
