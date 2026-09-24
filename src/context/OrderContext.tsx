"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Order } from "@/types/order";

type OrderContextValue = {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  createOrder: (
    items: Order["items"],
    subtotal: number,
    discount: number,
    restaurantName: string,
    voucherCode?: string,
  ) => Order;
};

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

function createOrderId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Date.now().toString();
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrders = window.localStorage.getItem("foodhub_orders");

      if (storedOrders) {
        try {
          const parsedOrders: unknown = JSON.parse(storedOrders);
          if (Array.isArray(parsedOrders)) {
            setOrders(parsedOrders);
          }
        } catch {
          window.localStorage.removeItem("foodhub_orders");
        }
      }
    }

    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (hasHydrated.current && typeof window !== "undefined") {
      window.localStorage.setItem("foodhub_orders", JSON.stringify(orders));
    }
  }, [orders]);

  const createOrder = (
    items: Order["items"],
    subtotal: number,
    discount: number,
    restaurantName: string,
    voucherCode?: string,
  ) => {
    const order: Order = {
      id: createOrderId(),
      restaurantName,
      items,
      subtotal,
      discount,
      total: subtotal - discount,
      ...(voucherCode ? { voucherCode } : {}),
      status: "placed",
      createdAt: new Date().toISOString(),
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    return order;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }

  return context;
}
