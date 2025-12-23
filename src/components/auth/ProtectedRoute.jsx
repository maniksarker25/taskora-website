"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/lib/features/auth/authSlice";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    // If requiredRole is specified and user role doesn't match, logout and redirect to login
    // Added 'user' check to prevent logout if user object is temporarily missing during re-hydration
    if (!isLoading && isAuthenticated && user && requiredRole && user?.role !== requiredRole) {
      // Logout the user
      dispatch(logout());

      // Clear refreshToken cookie
      if (typeof document !== 'undefined') {
        document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax';
        if (process.env.NODE_ENV === 'production') {
          document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax; Secure';
        }
      }

      // Redirect to login
      router.push("/login");
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, dispatch]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#115E59]"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check role if required - if role doesn't match, don't render (logout already handled in useEffect)
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

