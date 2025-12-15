"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/lib/features/auth/authSlice";

const ProviderProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isLoading && isAuthenticated && user?.role !== 'provider' ) {
      // dispatch(logout());
      
      // if (typeof document !== 'undefined') {
      //   document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax';
      // }
      
      router.push("/");
      return;
    }
  }, [isAuthenticated, isLoading, user, router, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#115E59]"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'provider') {
    return null;
  }

  return <>{children}</>;
};

export default ProviderProtectedRoute;

