"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type FavoritesContextValue = {
  favorites: string[];
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = window.localStorage.getItem("foodhub_favorites");

      if (storedFavorites) {
        try {
          const parsedFavorites: unknown = JSON.parse(storedFavorites);
          if (Array.isArray(parsedFavorites)) {
            setFavorites(parsedFavorites);
          }
        } catch {
          window.localStorage.removeItem("foodhub_favorites");
        }
      }
    }

    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (hasHydrated.current && typeof window !== "undefined") {
      window.localStorage.setItem(
        "foodhub_favorites",
        JSON.stringify(favorites),
      );
    }
  }, [favorites]);

  const toggleFavorite = (restaurantId: string) => {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(restaurantId)
        ? currentFavorites.filter((id) => id !== restaurantId)
        : [...currentFavorites, restaurantId],
    );
  };

  const isFavorite = (restaurantId: string) => favorites.includes(restaurantId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
