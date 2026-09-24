"use client";

import { useState } from "react";
import { getAllMenuItems } from "@/lib/data/menu";

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState(() => getAllMenuItems());

  const deleteMenuItem = (menuItemId: string) => {
    // Local-only demo interaction; there is no real database yet.
    setMenuItems((currentItems) =>
      currentItems.filter((item) => item.id !== menuItemId),
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Menu</h1>
      {menuItems.length === 0 ? (
        <p className="mt-12 text-center text-neutral-600">No menu items</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-600">
                <th className="px-3 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Restaurant</th>
                <th className="px-3 py-3 font-medium">Price</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-b border-neutral-200">
                  <td className="px-3 py-3 font-medium">{item.name}</td>
                  <td className="px-3 py-3">{item.restaurantId}</td>
                  <td className="px-3 py-3">${item.price.toFixed(2)}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                      {item.isVeg ? "Veg" : "Non-veg"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => deleteMenuItem(item.id)}
                      className="rounded-lg border border-neutral-300 px-3 py-1 text-sm text-neutral-600"
                    >
                      Delete
                    </button>
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
