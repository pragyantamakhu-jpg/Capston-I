"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { calculateDiscount } from "@/lib/cart/calculateDiscount";
import { getAllMenuItems } from "@/lib/data/menu";
import { getRestaurantById } from "@/lib/data/restaurants";
import { getVoucherByCode } from "@/lib/data/vouchers";
import type { Voucher } from "@/types/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({ fullName: false, address: false });
  const [submitError, setSubmitError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      router.replace("/cart");
      return;
    }

    // Keep the voucher in the URL so checkout can recompute the discount without shared voucher state.
    const code = new URLSearchParams(window.location.search).get("voucher");
    const matchedVoucher = code ? getVoucherByCode(code) : undefined;

    if (matchedVoucher) {
      setVoucher(matchedVoucher);
    }
    setIsReady(true);
  }, [cart.length, router]);

  const discount = calculateDiscount(subtotal, voucher);
  const total = subtotal - discount;

  const placeOrder = () => {
    const nextErrors = {
      fullName: fullName.trim() === "",
      address: address.trim() === "",
    };
    setErrors(nextErrors);

    if (nextErrors.fullName || nextErrors.address) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const firstMenuItem = getAllMenuItems().find(
        (menuItem) => menuItem.id === cart[0]?.menuItemId,
      );
      const restaurant = firstMenuItem
        ? getRestaurantById(firstMenuItem.restaurantId)
        : undefined;
      const order = createOrder(
        cart,
        subtotal,
        discount,
        restaurant?.name ?? "Unknown restaurant",
        voucher?.code,
      );
      clearCart();
      router.push(`/orders/${order.id}`);
    } catch {
      setSubmitError("Something went wrong placing your order. Try again.");
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Checkout</h1>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-3 border-y border-neutral-200">
          {cart.map((item) => (
            <div
              key={item.menuItemId}
              className="flex justify-between gap-4 border-b border-neutral-200 py-3 last:border-b-0"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {voucher && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({voucher.code})</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold text-neutral-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Delivery details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="full-name" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="full-name"
              type="text"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">Full name is required</p>
            )}
          </div>
          <div>
            <label htmlFor="delivery-address" className="text-sm font-medium">
              Delivery address
            </label>
            <textarea
              id="delivery-address"
              required
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-1 min-h-24 w-full rounded-lg border border-neutral-300 px-3 py-2"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                Delivery address is required
              </p>
            )}
          </div>
        </div>
      </section>

      {submitError && (
        <p className="mt-4 text-sm text-red-600">{submitError}</p>
      )}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={placeOrder}
        className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-3 text-white disabled:opacity-60"
      >
        {isSubmitting ? "Placing order..." : "Place order"}
      </button>
      <Link
        href="/cart"
        className="mt-3 block text-center text-sm text-neutral-600"
      >
        Back to cart
      </Link>
    </div>
  );
}
