"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Spinner } from "@/components/shared/Spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Public routes that don't need auth
    const isPublicRoute = ["/login", "/register", "/forgot-password", "/"].includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
    } else if (isAuthenticated && isPublicRoute) {
      if (!role && pathname !== "/choose-role") {
        router.push("/choose-role");
      } else if (role) {
        router.push("/dashboard");
      }
    } else if (isAuthenticated && !role && pathname !== "/choose-role") {
      router.push("/choose-role");
    }
  }, [isAuthenticated, isMounted, pathname, role, router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Prevent flashing protected content before redirect
  const isPublicRoute = ["/login", "/register", "/forgot-password", "/"].includes(pathname);
  if (!isAuthenticated && !isPublicRoute) {
    return null; 
  }
  if (isAuthenticated && isPublicRoute && role) {
    return null;
  }
  if (isAuthenticated && !role && pathname !== "/choose-role") {
    return null;
  }

  return <>{children}</>;
}
