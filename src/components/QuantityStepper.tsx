"use client";

import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
}: QuantityStepperProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-lg border border-neutral-300 px-2 py-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={quantity === 0}
        onClick={onDecrement}
        className={`text-neutral-600 ${
          quantity === 0 ? "cursor-not-allowed opacity-40" : ""
        }`}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <span className="min-w-5 text-center text-sm font-medium">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrement}
        className="text-neutral-600"
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
