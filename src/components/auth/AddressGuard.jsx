"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/useAuth";

const AddressGuard = ({ children }) => {
    const {
        isAuthenticated,
        isAddressProvided,
        isLoading: isAuthLoading,
        isProfileLoading,
        user
    } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If auth or profile is loading, do nothing yet
        if (isAuthLoading || isProfileLoading) return;

        // If user is authenticated and not admin
        if (isAuthenticated && user?.role !== 'admin') {
            // Define public routes that don't require address verification
            const publicRoutes = ["/", "/about", "/contact", "/faq", "/sitesmap", "/privacy", "/terms"];

            // If address is NOT provided in Redux (which is now synced by useAuth/getMyProfile)
            if (!isAddressProvided) {
                // If currently on a page that is NOT the verify page (and not in public allowed list)
                if (
                    pathname !== "/verify" &&
                    pathname !== "/logout" &&
                    pathname !== "/verify_register_user" &&
                    pathname !== "/login" &&
                    !publicRoutes.includes(pathname)
                ) {
                    // console.log("AddressGuard: Redirecting to /verify because isAddressProvided is false");
                    router.push("/verify");
                }
            }
        }
    }, [isAuthenticated, isAddressProvided, isAuthLoading, isProfileLoading, pathname, router, user]);

    return <>{children}</>;
};

export default AddressGuard;
