"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Icons
import { FaCalendarAlt, FaChevronDown, FaHandshake } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { MdAccountBox, MdClose, MdMenu, MdNotificationsNone } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import { RiUserSettingsFill } from "react-icons/ri";

// Redux & API
import { useGetMyProfileQuery, useUpgradeAccountMutation } from "@/lib/features/auth/authApi";
import { logout } from "@/lib/features/auth/authSlice";

// Assets
import taskalleyLogo from "../../../public/Group (5).svg";
import defaultAvatar from "../../../public/profile_image.jpg";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: profileData, isLoading: isProfileLoading } = useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [upgradeAccount, { isLoading: isUpgrading }] = useUpgradeAccountMutation();

  const userData = profileData?.data;
  const isMultiRole = userData?.user?.isMultiRole;
  const currentRole = isAuthenticated ? user?.role : "guest";
  console.log("current role===============>", currentRole);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleUpgradeOrSwitch = async () => {
    try {
      const result = await upgradeAccount().unwrap();
      const updatedUser = result?.data;

      if (updatedUser?.role === "provider") {
        if (!updatedUser.isAddressProvided) return router.push("/verify");
        if (!updatedUser.isBankNumberVerified) return router.push("/bank_verification");
        if (!updatedUser.isIdentificationDocumentVerified) return router.push("/id_card_verify");
      }

      toast.success(result.message || "Account updated successfully");
      setIsProfileOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Action failed");
    }
  };

  const NavLink = ({ href, children, icon: Icon }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
          isActive
            ? "text-[#115E59] bg-teal-50"
            : "text-gray-600 hover:text-[#115E59] hover:bg-gray-50"
        }`}
      >
        {Icon && <Icon className={isActive ? "text-[#115E59]" : "text-gray-400"} />}
        {children}
      </Link>
    );
  };

  if (!mounted) return <div className="h-20 bg-white border-b border-gray-100" />;

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex-shrink-0 transition-transform active:scale-95">
          <Image src={taskalleyLogo} alt="TaskAlley" height={42} priority />
        </Link>

        {/* Center: Main Navigation (Desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          {currentRole === "guest" && (
            <>
              <NavLink href="/categories">Categories</NavLink>
              <NavLink href="/browseservice">Browse Tasks</NavLink>
              <NavLink href="/service-listing">Services</NavLink>
              <NavLink href="/contact">Help</NavLink>
            </>
          )}
          {currentRole === "customer" && (
            <>
              <NavLink href="/post_task">Post a Task</NavLink>
              <NavLink href="/browseservice">Find Tasks</NavLink>
              <NavLink href="/service-listing">Hire Experts</NavLink>
            </>
          )}
          {currentRole === "provider" && (
            <>
              <NavLink href="/browseservice">Browse Tasks</NavLink>
              <NavLink href="/list_my_service">My Services</NavLink>
              <NavLink href="/chat" icon={FaMessage}>
                Messages
              </NavLink>
            </>
          )}
        </div>

        {/* Right Section: Auth/Profile */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Notification button */}
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full hidden sm:block">
                <MdNotificationsNone size={24} />
              </button>

              {/* Profile Dropdown Component */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:border-[#115E59] transition-all bg-white cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-100">
                    <img
                      src={userData?.profile_image || defaultAvatar.src}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <FaChevronDown
                    className={`text-[10px] text-gray-400 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Desktop Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-4 border-b border-gray-50 mb-2">
                      <p className="font-bold text-gray-900 truncate">{userData?.name}</p>
                      <p className="text-xs text-gray-500 truncate mb-2">{user?.email}</p>
                      <span className="px-2 py-0.5 bg-teal-50 text-[#115E59] text-[10px] font-bold rounded uppercase tracking-wider">
                        {user?.role === "provider" ? "Freelancer" : "Tasker"}
                      </span>
                    </div>

                    <div className="px-2 space-y-1">
                      <NavLink
                        href={user?.role === "provider" ? "/my_bids" : "/my_task"}
                        icon={user?.role === "provider" ? FaHandshake : FaCalendarAlt}
                      >
                        {user?.role === "provider" ? "My Bids" : "My Tasks"}
                      </NavLink>
                      <NavLink href="/chat" icon={FaMessage}>
                        Messages
                      </NavLink>
                      <NavLink
                        href={user?.role === "provider" ? "/service_profile_info" : "/profile_info"}
                        icon={RiUserSettingsFill}
                      >
                        Profile Settings
                      </NavLink>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-50 px-2 space-y-1 ">
                      <button
                        onClick={handleUpgradeOrSwitch}
                        disabled={isUpgrading}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#115E59] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                      >
                        {isUpgrading ? (
                          <div className="h-4 w-4 border-2 border-[#115E59] border-t-transparent animate-spin rounded-full" />
                        ) : (
                          <MdAccountBox size={18} />
                        )}
                        {isMultiRole
                          ? currentRole == "customer"
                            ? "Switch to Service Provider"
                            : "Switch to Customer"
                          : currentRole == "customer"
                          ? "Become a Service Provider"
                          : "Become a Customer"}
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <PiSignOutBold size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-bold text-[#115E59] hover:text-[#0d4a42]"
              >
                Log In
              </Link>
              <Link
                href="/role"
                className="px-6 py-2.5 text-sm font-bold bg-[#115E59] text-white rounded-xl hover:bg-[#0d4a42] shadow-md shadow-teal-900/10 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#115E59] bg-teal-50 rounded-lg active:scale-90 transition-all"
          >
            {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-6 space-y-4 animate-in slide-in-from-right duration-300">
          <div className="space-y-2">
            {/* Contextual Links based on role */}
            {currentRole === "guest" && (
              <div className="flex flex-col gap-2">
                <NavLink href="/categories">Categories</NavLink>
                <NavLink href="/browseservice">Browse Tasks</NavLink>
                <NavLink href="/service-listing">Services</NavLink>
              </div>
            )}
            {isAuthenticated && (
              <div className="bg-gray-50 p-4 rounded-2xl mb-4 ">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={userData?.profile_image || defaultAvatar.src}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    alt=""
                  />
                  <div>
                    <p className="font-bold text-gray-900">{userData?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/chat"
                    className="flex flex-col items-center p-3 bg-white rounded-xl text-[10px] font-bold text-gray-600"
                  >
                    <FaMessage className="mb-1 text-[#115E59]" /> Chat
                  </Link>
                  <Link
                    href="/profile_info"
                    className="flex flex-col items-center p-3 bg-white rounded-xl text-[10px] font-bold text-gray-600"
                  >
                    <RiUserSettingsFill className="mb-1 text-[#115E59] " /> Profile
                  </Link>
                </div>
              </div>
            )}
          </div>

          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <Link
                href="/login"
                className="py-3 text-center text-sm font-bold text-[#115E59] border border-[#115E59] rounded-xl"
              >
                Login
              </Link>
              <Link
                href="/role"
                className="py-3 text-center text-sm font-bold bg-[#115E59] text-white rounded-xl"
              >
                Register
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full py-4 text-center text-sm font-bold text-red-500 bg-red-50 rounded-xl flex items-center justify-center gap-2"
            >
              <PiSignOutBold /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
