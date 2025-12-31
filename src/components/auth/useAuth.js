"use client";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useGetMyProfileQuery } from "@/lib/features/auth/authApi";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // Also track profile query state
  const {
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
    data: profileData
  } = useGetMyProfileQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const handleLogout = () => {
    dispatch(logout());

    // Clear refreshToken cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax';
      if (process.env.NODE_ENV === 'production') {
        document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax; Secure';
      }
    }

    router.push("/login");
  };

  return {
    ...auth,
    isProfileLoading,
    isProfileFetching,
    profileData,
    logout: handleLogout,
    isCustomer: auth.user?.role === 'customer',
    isProvider: auth.user?.role === 'provider',
  };
};

