import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FavoritesProvider } from "@/context/FavoritesContext";
import HomePage from "./page";

describe("HomePage", () => {
  it("shows the empty state when Favorites has no saved restaurants", async () => {
    const user = userEvent.setup();

    render(
      <FavoritesProvider>
        <HomePage />
      </FavoritesProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Favorites" }));

    expect(screen.getByText("No favorites yet")).toBeInTheDocument();
  });
});
