"use client";

import { useOrders } from "@/context/OrderContext";
import type { Order } from "@/types/order";

const statuses: Order["status"][] = ["placed", "confirmed", "delivered"];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-12 text-center text-neutral-600">No orders yet</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-600">
                <th className="px-3 py-3 font-medium">Order</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Items</th>
                <th className="px-3 py-3 font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-neutral-200">
                  <td className="px-3 py-3 font-mono">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-3 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3">
                    {order.items.reduce(
                      (count, item) => count + item.quantity,
                      0,
                    )}
                  </td>
                  <td className="px-3 py-3">${order.total.toFixed(2)}</td>
                  <td className="px-3 py-3">
                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateOrderStatus(
                          order.id,
                          event.target.value as Order["status"],
                        )
                      }
                      className="rounded-lg border border-neutral-300 px-2 py-1"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
