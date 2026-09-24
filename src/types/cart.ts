export interface CartLine {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Voucher {
  code: string;
  type: "percentage" | "flat";
  value: number;
}
