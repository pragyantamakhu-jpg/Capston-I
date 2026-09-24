"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

const PUBLIC_ROUTES = ["/login", "/signup", "/health"];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.replace("/login");
    }
  }, [isPublicRoute, loading, router, user]);

  if (isPublicRoute) {
    return children;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-600">
        Loading...
      </div>
    );
  }

  return user ? children : null;
}
