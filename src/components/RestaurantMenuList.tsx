"use client";

import { useState } from "react";
import FilterChips, { type MenuFilter } from "@/components/FilterChips";
import MenuItemCard from "@/components/MenuItemCard";
import type { MenuItem } from "@/types/catalog";

export default function RestaurantMenuList({ items }: { items: MenuItem[] }) {
  const [activeFilter, setActiveFilter] = useState<MenuFilter>("all");
  const filteredItems = items.filter((item) => {
    if (activeFilter === "veg") return item.isVeg;
    if (activeFilter === "nonveg") return !item.isVeg;
    return true;
  });

  return (
    <>
      <FilterChips
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <div>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <MenuItemCard key={item.id} {...item} />)
        ) : (
          <p className="py-4 text-sm text-neutral-600">
            No items match this filter
          </p>
        )}
      </div>
    </>
  );
}
