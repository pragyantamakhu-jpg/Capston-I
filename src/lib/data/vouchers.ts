import vouchersJson from "@/lib/mock/vouchers.json";
import type { Voucher } from "@/types/cart";

const vouchers = vouchersJson as Voucher[];

export function getVoucherByCode(code: string): Voucher | undefined {
  return vouchers.find(
    (voucher) => voucher.code.toLowerCase() === code.trim().toLowerCase(),
  );
}
