import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import QuantityStepper from "./QuantityStepper";

describe("QuantityStepper", () => {
  it("renders the current quantity", () => {
    render(
      <QuantityStepper
        quantity={3}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onIncrement once when the plus button is clicked", async () => {
    const user = userEvent.setup();
    const onIncrement = vi.fn();

    render(
      <QuantityStepper
        quantity={1}
        onIncrement={onIncrement}
        onDecrement={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Increase quantity" }));

    expect(onIncrement).toHaveBeenCalledOnce();
  });

  it("calls onDecrement once when the minus button is clicked above zero", async () => {
    const user = userEvent.setup();
    const onDecrement = vi.fn();

    render(
      <QuantityStepper
        quantity={1}
        onIncrement={vi.fn()}
        onDecrement={onDecrement}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));

    expect(onDecrement).toHaveBeenCalledOnce();
  });

  it("disables the minus button at zero and does not decrement", async () => {
    const user = userEvent.setup();
    const onDecrement = vi.fn();

    render(
      <QuantityStepper
        quantity={0}
        onIncrement={vi.fn()}
        onDecrement={onDecrement}
      />,
    );

    const minusButton = screen.getByRole("button", {
      name: "Decrease quantity",
    });

    expect(minusButton).toBeDisabled();
    await user.click(minusButton);
    expect(onDecrement).not.toHaveBeenCalled();
  });
});
