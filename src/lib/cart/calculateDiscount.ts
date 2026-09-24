import type { Voucher } from "@/types/cart";

export function calculateDiscount(
  subtotal: number,
  voucher: Voucher | null,
): number {
  if (!voucher) {
    return 0;
  }

  const discount =
    voucher.type === "percentage"
      ? subtotal * (voucher.value / 100)
      : voucher.value;

  return Math.min(subtotal, discount);
}
