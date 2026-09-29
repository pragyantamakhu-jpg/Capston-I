import type { Metadata } from "next";
import AuthGuard from "@/components/AuthGuard";
import Nav from "@/components/Nav";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { OrderProvider } from "@/context/OrderContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodHub",
  description: "Order food from your favorite restaurants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <AuthProvider>
          <Nav />
          <CartProvider>
            <FavoritesProvider>
              <OrderProvider>
                <AuthGuard>
                  <main className="mx-auto max-w-5xl px-4 py-6">
                    {children}
                  </main>
                </AuthGuard>
              </OrderProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
