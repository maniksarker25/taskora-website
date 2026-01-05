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
       
        if (isAuthLoading || isProfileLoading) return;

        
        if (isAuthenticated && user?.role !== 'admin') {
            
            const publicRoutes = ["/", "/about", "/contact", "/faq", "/sitesmap", "/privacy", "/terms"];

            
            if (!isAddressProvided) {
                
                if (
                    pathname !== "/verify" &&
                    pathname !== "/logout" &&
                    pathname !== "/verify_register_user" &&
                    pathname !== "/login" &&
                    !publicRoutes.includes(pathname)
                ) {
                    
                    // router.push("/");
                }
            }
        }
    }, [isAuthenticated, isAddressProvided, isAuthLoading, isProfileLoading, pathname, router, user]);

    return <>{children}</>;
};

export default AddressGuard;
