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
};

export default function RestaurantCard({
  id,
  name,
  cuisine,
  rating,
  image,
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
            loading="lazy"
            className="rounded-lg object-cover"
          />
        </div>
        <div className="mt-3">
          <h2 className="font-semibold text-neutral-900">{name}</h2>
          <p className="mt-1 text-sm text-neutral-600">{cuisine}</p>
          <p className="mt-1 text-sm text-neutral-600">
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
