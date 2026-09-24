"use client";

import { useOrders } from "@/context/OrderContext";
import { getRestaurants } from "@/lib/data/restaurants";

export default function AdminDashboardPage() {
  const { orders } = useOrders();
  const restaurants = getRestaurants();
  const revenue = orders.reduce((total, order) => total + order.total, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-neutral-100 p-4">
          <p className="text-sm text-neutral-600">Total orders</p>
          <p className="mt-2 text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-lg bg-neutral-100 p-4">
          <p className="text-sm text-neutral-600">Total revenue</p>
          <p className="mt-2 text-2xl font-bold">${revenue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-neutral-100 p-4">
          <p className="text-sm text-neutral-600">Total restaurants</p>
          <p className="mt-2 text-2xl font-bold">{restaurants.length}</p>
        </div>
      </div>
    </div>
  );
}
