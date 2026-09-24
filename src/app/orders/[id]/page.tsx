"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useOrders } from "@/context/OrderContext";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { orders } = useOrders();
  const order = orders.find((candidate) => candidate.id === params.id);

  if (!order) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link href="/orders" className="mt-4 inline-block text-brand-600">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {order.restaurantName || `Order ${order.id.slice(0, 8)}`}
          </h1>
          <p className="mt-1 font-mono text-xs text-neutral-400">
            Order {order.id.slice(0, 8)}
          </p>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm capitalize text-neutral-600">
          {order.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-neutral-600">
        Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-6 border-y border-neutral-200">
        {order.items.map((item) => (
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
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${order.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
