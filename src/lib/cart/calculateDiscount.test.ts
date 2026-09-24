import { describe, expect, it } from "vitest";
import { calculateDiscount } from "./calculateDiscount";

describe("calculateDiscount", () => {
  it("calculates a percentage discount", () => {
    expect(
      calculateDiscount(50, { code: "SAVE20", type: "percentage", value: 20 }),
    ).toBe(10);
  });

  it("calculates a flat discount", () => {
    expect(
      calculateDiscount(50, { code: "FLAT5", type: "flat", value: 5 }),
    ).toBe(5);
  });

  it("never discounts more than the subtotal", () => {
    expect(
      calculateDiscount(5, { code: "FLAT10", type: "flat", value: 10 }),
    ).toBe(5);
  });

  it("returns zero for a null voucher", () => {
    expect(calculateDiscount(50, null)).toBe(0);
  });
});
