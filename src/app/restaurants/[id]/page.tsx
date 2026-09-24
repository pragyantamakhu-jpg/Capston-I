import MiniCartBar from "@/components/MiniCartBar";
import RestaurantMenuList from "@/components/RestaurantMenuList";
import { getMenuByRestaurantId } from "@/lib/data/menu";
import { getRestaurantById } from "@/lib/data/restaurants";
import Link from "next/link";

export default async function RestaurantMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Restaurant not found</h1>
        <Link href="/" className="mt-4 inline-block text-brand-600">
          Back to restaurants
        </Link>
      </div>
    );
  }

  const menuItems = getMenuByRestaurantId(id);

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        <p className="mt-2 text-neutral-600">
          {restaurant.cuisine} · Rating {restaurant.rating.toFixed(1)}
        </p>
      </header>
      <RestaurantMenuList items={menuItems} />
      <MiniCartBar />
    </div>
  );
}
