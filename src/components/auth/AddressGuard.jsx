"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/useAuth";

const AddressGuard = ({ children }) => {
    const { isAuthenticated, isAddressProvided, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If loading, do nothing yet
        if (isLoading) return;

        // If user is authenticated
        if (isAuthenticated && user?.role !== 'admin') {
            // If address is NOT provided
            if (!isAddressProvided) {
                // If currently on a page that is NOT the verify page (and not in public allowed list that might be part of flow)
                // Actually, we generally want to force them to /verify if they are logged in and unverified.
                // But we must allow them to be ON /verify.

                if (pathname !== "/verify" && pathname !== "/logout") {
                    router.push("/verify");
                }
            }
        }
    }, [isAuthenticated, isAddressProvided, isLoading, pathname, router, user]);

    return <>{children}</>;
};

export default AddressGuard;
