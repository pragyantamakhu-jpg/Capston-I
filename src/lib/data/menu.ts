import menuJson from "@/lib/mock/menu.json";
import type { MenuItem } from "@/types/catalog";

export function getMenuByRestaurantId(restaurantId: string): MenuItem[] {
  return getAllMenuItems().filter((item) => item.restaurantId === restaurantId);
}

export function getAllMenuItems(): MenuItem[] {
  return menuJson;
}
