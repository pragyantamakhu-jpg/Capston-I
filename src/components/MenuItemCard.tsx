"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import QuantityStepper from "@/components/QuantityStepper";

type MenuItemCardProps = {
  id: string;
  name: string;
  price: number;
  isVeg: boolean;
  image: string;
};

export default function MenuItemCard({
  id,
  name,
  price,
  isVeg,
  image,
}: MenuItemCardProps) {
  const { cart, addItem, incrementItem, decrementItem } = useCart();
  const quantity =
    cart.find((cartItem) => cartItem.menuItemId === id)?.quantity ?? 0;

  void id;
  void isVeg;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-neutral-200 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={image}
            alt={name}
            width={44}
            height={44}
            loading="lazy"
            className="rounded-lg object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-900">
            {name}
          </p>
          <p className="mt-1 text-sm text-neutral-600">₹{price}</p>
        </div>
      </div>
      <QuantityStepper
        quantity={quantity}
        onDecrement={() => decrementItem(id)}
        onIncrement={() =>
          quantity === 0
            ? addItem({ menuItemId: id, name, price })
            : incrementItem(id)
        }
      />
    </div>
  );
}
