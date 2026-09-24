export interface Order {
  id: string;
  restaurantName: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  voucherCode?: string;
  status: "placed" | "confirmed" | "delivered";
  createdAt: string;
}
