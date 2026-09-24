"use client";

import Link from "next/link";
import { useState } from "react";
import QuantityStepper from "@/components/QuantityStepper";
import { useCart } from "@/context/CartContext";
import { calculateDiscount } from "@/lib/cart/calculateDiscount";
import { getVoucherByCode } from "@/lib/data/vouchers";
import type { Voucher } from "@/types/cart";

export default function CartPage() {
  const { cart, subtotal, incrementItem, decrementItem } = useCart();
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherError, setVoucherError] = useState(false);

  const discount = calculateDiscount(subtotal, appliedVoucher);
  const total = subtotal - discount;

  const applyVoucher = () => {
    const match = getVoucherByCode(voucherCode);

    if (match) {
      setAppliedVoucher(match);
      setVoucherError(false);
      return;
    }

    setAppliedVoucher(null);
    setVoucherError(true);
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-neutral-600">
          Browse restaurants to get started
        </p>
        <Link
          href="/"
          className="mt-6 rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-600"
        >
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Cart</h1>
      <div className="mt-4">
        {cart.map((item) => (
          <div
            key={item.menuItemId}
            className="flex items-center justify-between gap-3 border-b border-neutral-200 py-4"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-neutral-900">
                {item.name}
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                ${item.price.toFixed(2)} each
              </p>
            </div>
            <QuantityStepper
              quantity={item.quantity}
              onIncrement={() => incrementItem(item.menuItemId)}
              onDecrement={() => decrementItem(item.menuItemId)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={voucherCode}
            onChange={(event) => setVoucherCode(event.target.value)}
            placeholder="Voucher code"
            aria-label="Voucher code"
            className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={applyVoucher}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-600"
          >
            Apply
          </button>
        </div>
        {voucherError && (
          <p className="mt-2 text-sm text-red-600">Invalid or expired code</p>
        )}
      </div>

      <div className="mt-6 border-t border-neutral-200 pt-4">
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {appliedVoucher && (
          <div className="mt-2 flex justify-between text-sm text-green-600">
            <span>Discount ({appliedVoucher.code})</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="mt-3 flex justify-between font-semibold text-neutral-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Link
        href={
          appliedVoucher
            ? `/checkout?voucher=${encodeURIComponent(appliedVoucher.code)}`
            : "/checkout"
        }
        className="mt-6 block w-full rounded-lg bg-brand-600 px-4 py-3 text-center text-white"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
