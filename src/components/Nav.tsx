"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import RecommendModal from "@/components/RecommendModal";

const links = [
  { href: "/", label: "Home" },
  { href: "/orders", label: "Orders" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);

  return (
    <>
      <nav className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold text-brand-600">
            FoodHub
          </Link>
          <div className="flex items-center gap-4">
            <ul className="flex gap-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm ${
                      pathname === link.href
                        ? "font-semibold text-brand-600"
                        : "text-neutral-600 hover:text-brand-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {!loading && !user && (
                <li>
                  <Link
                    href="/login"
                    className={`text-sm ${
                      pathname === "/login"
                        ? "font-semibold text-brand-600"
                        : "text-neutral-600 hover:text-brand-600"
                    }`}
                  >
                    Login
                  </Link>
                </li>
              )}
              {!loading && user && (
                <li className="flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => setIsRecommendOpen(true)}
                    aria-label="Recommend a meal"
                    className="flex items-center gap-1 text-neutral-600 hover:text-brand-600"
                  >
                    <Sparkles size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Recommend</span>
                  </button>
                  <span
                    className="max-w-40 truncate text-neutral-600"
                    title={user.email ?? "Account"}
                  >
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await signOutUser();
                      router.replace("/login");
                    }}
                    className="text-neutral-600 hover:text-brand-600"
                  >
                    Log out
                  </button>
                </li>
              )}
            </ul>
            <Link
              href="/cart"
              aria-label="Cart"
              title="Cart"
              className={
                pathname === "/cart"
                  ? "text-brand-600"
                  : "text-neutral-600 hover:text-brand-600"
              }
            >
              <ShoppingCart size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </nav>
      <RecommendModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
      />
    </>
  );
}
