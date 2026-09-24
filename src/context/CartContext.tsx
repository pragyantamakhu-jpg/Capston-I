"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CartLine } from "@/types/cart";

type CartContextValue = {
  cart: CartLine[];
  addItem: (item: Omit<CartLine, "quantity">) => void;
  removeItem: (menuItemId: string) => void;
  incrementItem: (menuItemId: string) => void;
  decrementItem: (menuItemId: string) => void;
  clearCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = window.localStorage.getItem("foodhub_cart");

      if (storedCart) {
        try {
          const parsedCart: unknown = JSON.parse(storedCart);
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          }
        } catch {
          window.localStorage.removeItem("foodhub_cart");
        }
      }
    }

    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (hasHydrated.current && typeof window !== "undefined") {
      window.localStorage.setItem("foodhub_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addItem = (item: Omit<CartLine, "quantity">) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.menuItemId === item.menuItemId,
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.menuItemId === item.menuItemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.menuItemId !== menuItemId),
    );
  };

  const incrementItem = (menuItemId: string) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decrementItem = (menuItemId: string) => {
    setCart((currentCart) =>
      currentCart.flatMap((item) => {
        if (item.menuItemId !== menuItemId) {
          return [item];
        }

        return item.quantity > 1
          ? [{ ...item, quantity: item.quantity - 1 }]
          : [];
      }),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
