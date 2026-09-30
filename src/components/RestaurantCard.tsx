"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

type RestaurantCardProps = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  priority?: boolean;
};

export default function RestaurantCard({
  id,
  name,
  cuisine,
  rating,
  image,
  priority = false,
}: RestaurantCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);

  return (
    <article className="relative">
      <Link href={`/restaurants/${id}`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) calc((100vw - 48px) / 2), calc(100vw - 32px)"
            quality={75}
            preload={priority}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="mt-3">
          <h2 className="font-semibold text-neutral-900">{name}</h2>
          <p className="mt-1 text-sm text-neutral-700">{cuisine}</p>
          <p className="mt-1 text-sm text-neutral-700">
            Rating {rating.toFixed(1)}
          </p>
        </div>
      </Link>
      <button
        type="button"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(event) => {
          event.stopPropagation();
          toggleFavorite(id);
        }}
        className={`absolute top-3 right-3 rounded-full bg-white/90 p-2 ${
          favorite ? "text-red-500" : "text-neutral-500"
        }`}
      >
        <Heart
          size={20}
          fill={favorite ? "currentColor" : "none"}
          aria-hidden="true"
        />
      </button>
    </article>
  );
}
