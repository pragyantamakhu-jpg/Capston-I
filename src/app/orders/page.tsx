"use client";

import Link from "next/link";
import { useOrders } from "@/context/OrderContext";

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold">Order History</h1>
      {orders.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-neutral-600">No orders yet</p>
          <Link href="/" className="mt-4 inline-block text-brand-600">
            Browse restaurants
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 p-4"
            >
              <div>
                <p className="font-semibold">
                  {order.restaurantName || `Order ${order.id.slice(0, 8)}`}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {order.items.reduce(
                    (count, item) => count + item.quantity,
                    0,
                  )}{" "}
                  items
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.total.toFixed(2)}</p>
                <p className="mt-1 text-sm capitalize text-neutral-600">
                  {order.status}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
