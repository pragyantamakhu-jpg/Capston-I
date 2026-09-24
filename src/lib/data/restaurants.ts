import restaurantsJson from "@/lib/mock/restaurants.json";
import type { Restaurant } from "@/types/catalog";

export function getRestaurants(): Restaurant[] {
  return restaurantsJson;
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return getRestaurants().find((restaurant) => restaurant.id === id);
}
