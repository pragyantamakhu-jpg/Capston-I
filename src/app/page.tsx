"use client";

import HomeTabs from "@/components/HomeTabs";
import type { HomeTab } from "@/components/HomeTabs";
import RestaurantCard from "@/components/RestaurantCard";
import { useFavorites } from "@/context/FavoritesContext";
import { getRestaurants } from "@/lib/data/restaurants";
import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<HomeTab>("All restaurants");
  const { isFavorite } = useFavorites();
  const restaurants = getRestaurants();
  const visibleRestaurants =
    activeTab === "Favorites"
      ? restaurants.filter((restaurant) => isFavorite(restaurant.id))
      : restaurants;

  return (
    <div>
      <h1 className="text-2xl font-bold">Restaurants</h1>
      <HomeTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {visibleRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-48 flex-col items-center justify-center text-center">
          <p className="text-lg font-semibold">No favorites yet</p>
          <p className="mt-2 text-sm text-neutral-600">
            Tap the heart on any restaurant to save it here
          </p>
        </div>
      )}
    </div>
  );
}
