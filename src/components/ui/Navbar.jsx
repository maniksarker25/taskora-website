// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { MdMenu, MdClose, MdAccountBox } from "react-icons/md";
// import taskalleyLogo from "../../../public/Group (5).svg";
// import { FaCalendarAlt } from "react-icons/fa";
// import { FaMessage } from "react-icons/fa6";
// import { RiUserSettingsFill } from "react-icons/ri";
// import { PiSignOutBold } from "react-icons/pi";
// import { FaHandshake } from "react-icons/fa";
// import { logout } from "@/lib/features/auth/authSlice";
// import client from "../../../public/profile_image.jpg";
// import { toast } from "sonner";
// import { useGetMyProfileQuery, useUpgradeAccountMutation } from "@/lib/features/auth/authApi";

// const Navbar = () => {
//   const pathname = usePathname();
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [desktopProfileOpen, setDesktopProfileOpen] = useState(false);

//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [upgradeAccount, { isLoading: isUpgrading }] = useUpgradeAccountMutation();
//   const { data, isLoading, error } = useGetMyProfileQuery(undefined, {
//     skip: !isAuthenticated,
//   });
//   const multiUserverify = data?.data.user.isMultiRole

//   const userData = data?.data

//   const handleLogout = () => {
//     dispatch(logout());
//     setDesktopProfileOpen(false);
//     router.push("/login");
//   };

//   const handleUpgradeAccount = async () => {

//     try {
//       const result = await upgradeAccount().unwrap();
//       const data = result?.data;

//       if (data?.role === "provider") {
//         if (!data.isAddressProvided) {
//           router.push("/verify");
//           return;
//         }

//         if (!data.isBankNumberVerified) {
//           router.push("/bank_verification");
//           return;
//         }

//         if (!data.isIdentificationDocumentVerified) {
//           router.push("/id_card_verify");
//           return;
//         }

//         router.push("/");
//       } else if (data?.role === "customer") {
//         router.push("/");
//       }

//       if (result?.success) {
//         toast.success(result.message || "Account upgraded successfully");
//         setDesktopProfileOpen(false);
//         setProfileOpen(false);
//       }

//     } catch (error) {

//       toast.error(error?.data?.message || "Account upgrade failed");
//     }
//   };

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!desktopProfileOpen) return;

//     const handleClickOutside = (event) => {
//       const dropdown = document.getElementById("desktop-profile-dropdown");
//       const avatarButton = document.getElementById("desktop-avatar-button");

//       if (
//         dropdown &&
//         avatarButton &&
//         !dropdown.contains(event.target) &&
//         !avatarButton.contains(event.target)
//       ) {
//         setDesktopProfileOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [desktopProfileOpen]);

//   const getLinkClass = (path, isButton = false) => {
//     const isActive = pathname === path;

//     if (isButton) {
//       return isActive
//         ? "px-4 py-2 bg-[#115e59] text-white rounded-md shadow-md"
//         : "px-4 py-2 bg-[#115e59] text-white rounded-md hover:bg-[#0d4a42] transition-colors";
//     }

//     return isActive
//       ? "font-semibold px-4 py-2 bg-[#115e59] text-white rounded-md shadow-md"
//       : "text-gray-800 hover:text-[#115e59] px-4 py-2 hover:border-b-2 hover:border-[#115e59] transition-all";
//   };

//   // Guest Links
//   const guestLinks = (
//     <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
//       <Link href="/categories" className={getLinkClass("/categories")}>
//         Categories
//       </Link>
//       <Link href="/browseservice" className={getLinkClass("/browseservice")}>
//         Browse Tasks
//       </Link>
//       <Link
//         href="/service-listing"
//         className={getLinkClass("/service-listing")}
//       >
//         Browse Service
//       </Link>
//       <Link href="/contact" className={getLinkClass("/contact")}>
//         Contact / Help
//       </Link>
//     </div>
//   );

//   const taskProviderLinks = (
//     <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
//       <Link href="/post_task" className={getLinkClass("/post_task")}>
//         Post A Task
//       </Link>
//       <Link href="/browseservice" className={getLinkClass("/browseservice")}>
//         Browse Tasks
//       </Link>
//       <Link
//         href="/service-listing"
//         className={getLinkClass("/service-listing")}
//       >
//         Browse Services
//       </Link>
//     </div>
//   );

//   const serviceProviderLinks = (
//     <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
//       <Link
//         href="/post_task"
//         className={getLinkClass("/post_task")}
//         onClick={(e) => {
//           e.preventDefault();
//           toast.error("Please switch or upgrade your account to Tasker to post a task");
//         }}
//       >
//         Post A Task
//       </Link>
//       <Link href="/browseservice" className={getLinkClass("/browseservice")}>
//         Browse Tasks
//       </Link>
//       <Link
//         href="/list_my_service"
//         className={getLinkClass("/list_my_service")}
//       >
//         My Services
//       </Link>
//     </div>
//   );

//   // Auth buttons with active states
//   const guestAuthButtons = (
//     <div className="flex flex-col lg:items-center lg:flex-row gap-3">
//       <Link
//         href="/login"
//         className={`px-6 py-2 border-2 border-[#115e59] rounded-md transition ${pathname === "/login"
//           ? "bg-[#115e59] text-white"
//           : "text-[#115e59] hover:bg-[#115e59] hover:text-white"
//           }`}
//       >
//         Log In
//       </Link>

//       <Link
//         href="/role"
//         className={`px-6 py-2 border-2 border-[#115e59] rounded-md transition ${pathname !== "/login"
//           ? "bg-[#115e59] text-white"
//           : "text-[#115e59] hover:bg-[#115e59] hover:text-white"
//           }`}
//       >
//         Register
//       </Link>
//     </div>
//   );

//   // Profile dropdown link class
//   const getProfileLinkClass = (path) => {
//     return pathname === path
//       ? "flex items-center gap-2 text-lg text-[#115e59] font-semibold px-3 py-2 border-b-2 border-[#115e59]"
//       : "flex items-center gap-2 text-lg hover:text-[#115e59] px-3 py-2 hover:border-b-2 hover:border-[#115e59] transition-all";
//   };

//   const role = mounted && isAuthenticated ? user?.role : "guest";

//   if (!mounted) {
//     return (
//       <nav className="w-full bg-white shadow-sm sticky top-0 z-50 py-2">
//         <div className="max-w-[1240px] mx-auto px-6 py-3 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="h-10 lg:h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
//           </Link>
//           <div className="w-8 h-8 bg-gray-200 animate-pulse rounded lg:hidden"></div>
//         </div>
//       </nav>
//     );
//   }

//   // Customer Desktop Profile Dropdown
//   const customerDesktopProfileDropdown = (
//     <div className="relative hidden lg:block">
//       <button
//         id="desktop-avatar-button"
//         onClick={() => setDesktopProfileOpen(!desktopProfileOpen)}
//         className="btn btn-ghost btn-circle avatar focus:outline-none cursor-pointer"

//       >
//         <div className="w-12 rounded-full overflow-hidden">
//           <img
//             alt={userData?.name}
//             src={userData?.profile_image || client.src}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </button>
//       {desktopProfileOpen && (
//         <ul
//           id="desktop-profile-dropdown"
//           className="absolute right-0 mt-3 rounded-box px-4 pr-10 py-4 shadow flex flex-col gap-3 bg-white z-50 min-w-[250px]"
//         >
//           <div className="flex items-center gap-3 pr-12 pb-6 border-b">
//             <div className="w-16 h-16 overflow-hidden rounded-xl">
//               <img
//                 alt="Profile"
//                 src={userData?.profile_image || client.src}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div>
//               <p className="text-base font-bold">{userData?.name}</p>
//               <p className="text-xs text-gray-600">{user?.email}</p>
//               <p className="text-sm text-[#115e59] font-medium">Tasker</p>
//             </div>
//           </div>

//           <Link
//             className={getProfileLinkClass("/my_task")}
//             href="/my_task"
//             onClick={() => setDesktopProfileOpen(false)}
//           >
//             <FaCalendarAlt className="text-[#115e59]" /> My Tasks
//           </Link>

//           <Link
//             className={getProfileLinkClass("/chat")}
//             href="/chat"
//             onClick={() => setDesktopProfileOpen(false)}
//           >
//             <FaMessage className="text-[#115e59]" /> Messages
//           </Link>

//           <Link
//             className={`${getProfileLinkClass(
//               "/profile_info"
//             )} border-b pb-4 mb-2`}
//             href="/profile_info"
//             onClick={() => setDesktopProfileOpen(false)}
//           >
//             <RiUserSettingsFill className="text-[#115e59]" /> My Profile
//           </Link>

//           <button
//             className={`flex items-center gap-2 text-lg hover:bg-green-50 hover:text-[#115E59] px-3 py-2 rounded-md transition-colors ${isUpgrading ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             onClick={handleUpgradeAccount}
//             disabled={isUpgrading}
//           >
//             {isUpgrading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 mr-2 text-[#115E59]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 {multiUserverify ? "Switching..." : " Upgrading..."}
//               </>
//             ) : (
//               <>
//                 <MdAccountBox className="text-[#115E59]" /> {multiUserverify ? "Switch Profile" : " Upgrade Account"}
//               </>
//             )}
//           </button>

//           <button
//             className="flex items-center gap-2 text-lg hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-md transition-colors"
//             onClick={handleLogout}
//           >
//             <PiSignOutBold className="text-red-500" /> Sign Out
//           </button>
//         </ul>
//       )}
//     </div>
//   );

//   // Provider Desktop Profile Dropdown
//   const providerDesktopProfileDropdown = (
//     <div className="relative hidden lg:block">
//       <button
//         id="desktop-avatar-button"
//         onClick={() => setDesktopProfileOpen(!desktopProfileOpen)}
//         className="btn btn-ghost btn-circle avatar focus:outline-none cursor-pointer"
//         aria-label="Toggle profile menu"
//       >
//         <div className="w-12 rounded-full overflow-hidden">
//           <img
//             alt="User Avatar"
//             src={userData?.profile_image || client.src}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </button>
//       {desktopProfileOpen && (
//         <ul
//           id="desktop-profile-dropdown"
//           className="absolute right-0 mt-3 rounded-box px-4 pr-10 py-4 shadow flex flex-col gap-3 bg-white z-50 min-w-[250px]"
//         >
//           <div className="flex items-center gap-3 pr-12 pb-6 border-b">
//             <div className="w-16 h-16 overflow-hidden rounded-xl">
//               <img
//                 alt="Profile"
//                 src={userData?.profile_image || client.src}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div>
//               <p className="text-base font-bold">{userData?.name}</p>
//               <p className="text-gray-600">{user?.email}</p>
//               <p className="text-sm text-[#115e59] font-medium">{user?.role === 'provider' ? "Freelancer" : "Tasker"}</p>
//             </div>
//           </div>

//           <Link
//             className={getProfileLinkClass("/my_bids")}
//             href="/my_bids"
//             onClick={() => setDesktopProfileOpen(false)}
//           >
//             <FaHandshake className="text-[#115e59]" /> My Bids
//           </Link>

//           <Link
//             className={getProfileLinkClass("/chat")}
//             href="/chat"
//             onClick={() => setDesktopProfileOpen(false)}
//           >
//             <FaMessage className="text-[#115e59]" /> Messages
//           </Link>

//           <Link
//             className={`${getProfileLinkClass(
//               "/service_profile_info"
//             )} border-b pb-4 mb-2`}
//             href="/service_profile_info"
//             onClick={() => setDesktopProfileOpen(false)}
//           >
//             <RiUserSettingsFill className="text-[#115e59]" /> My Profile
//           </Link>

//           <button
//             className={`flex items-center gap-2 text-lg hover:bg-green-50 hover:text-[#115E59] px-3 py-2 rounded-md transition-colors ${isUpgrading ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             onClick={handleUpgradeAccount}
//             disabled={isUpgrading}
//           >
//             {isUpgrading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 mr-2 text-[#115E59]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 {multiUserverify ? "Switching..." : " Upgrading..."}
//               </>
//             ) : (
//               <>
//                 <MdAccountBox className="text-[#115E59]" /> {multiUserverify ? "Switch Profile" : " Upgrade Account"}
//               </>
//             )}
//           </button>

//           <button
//             className="flex items-center gap-2 text-lg hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-md transition-colors"
//             onClick={handleLogout}
//           >
//             <PiSignOutBold className="text-red-500" /> Sign Out
//           </button>
//         </ul>
//       )}
//     </div>
//   );

//   // Customer Mobile Profile Dropdown
//   const customerMobileProfileDropdown = (
//     <div className="lg:hidden mt-6">
//       <button
//         className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-md transition-colors"
//         onClick={() => setProfileOpen(!profileOpen)}
//       >
//         <div className="w-10 h-10 rounded-full overflow-hidden">
//           <img
//             alt="User Avatar"
//             src={userData?.profile_image || client.src}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <span className="font-medium">My Account (Tasker)</span>
//         <div
//           className={`ml-auto transform transition-transform ${profileOpen ? "rotate-180" : ""
//             }`}
//         >
//           ▼
//         </div>
//       </button>
//       <div
//         className={`transition-all duration-500 overflow-hidden ${profileOpen ? "max-h-[400px] mt-4" : "max-h-0"
//           }`}
//       >
//         <div className="flex flex-col gap-2">
//           <Link className={getProfileLinkClass("/my_task")} href="/my_task">
//             <FaCalendarAlt className="text-[#115e59]" /> My Tasks
//           </Link>

//           <Link className={getProfileLinkClass("/chat")} href="/chat">
//             <FaMessage className="text-[#115e59]" /> Messages
//           </Link>

//           <Link
//             className={`${getProfileLinkClass(
//               "/profile_info"
//             )} border-b pb-4 mb-2`}
//             href="/profile_info"
//           >
//             <RiUserSettingsFill className="text-[#115e59]" /> My Profile
//           </Link>

//           <button
//             className={`flex items-center gap-2 text-lg hover:bg-green-50 hover:text-[#115E59] px-3 py-2 rounded-md transition-colors ${isUpgrading ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             onClick={handleUpgradeAccount}
//             disabled={isUpgrading}
//           >
//             {isUpgrading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 mr-2 text-[#115E59]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 {multiUserverify ? "Switching..." : " Upgrading..."}
//               </>
//             ) : (
//               <>
//                 <MdAccountBox className="text-[#115E59]" /> {multiUserverify ? "Switch Profile" : " Upgrade Account"}
//               </>
//             )}
//           </button>

//           <button
//             className="flex items-center gap-2 text-lg hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-md transition-colors"
//             onClick={handleLogout}
//           >
//             <PiSignOutBold className="text-red-500" /> Sign Out
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Provider Mobile Profile Dropdown
//   const providerMobileProfileDropdown = (
//     <div className="lg:hidden mt-6">
//       <button
//         className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-md transition-colors"
//         onClick={() => setProfileOpen(!profileOpen)}
//       >
//         <div className="w-10 h-10 rounded-full overflow-hidden">
//           <img
//             alt="User Avatar"
//             src={userData?.profile_image || client.src}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <span className="font-medium">My Account (Freelancer)</span>
//         <div
//           className={`ml-auto transform transition-transform ${profileOpen ? "rotate-180" : ""
//             }`}
//         >
//           ▼
//         </div>
//       </button>
//       <div
//         className={`transition-all duration-500 overflow-hidden ${profileOpen ? "max-h-[400px] mt-4" : "max-h-0"
//           }`}
//       >
//         <div className="flex flex-col gap-2">
//           <Link className={getProfileLinkClass("/my_bids")} href="/my_bids">
//             <FaHandshake className="text-[#115e59]" /> My Bids
//           </Link>

//           <Link className={getProfileLinkClass("/chat")} href="/chat">
//             <FaMessage className="text-[#115e59]" /> Messages
//           </Link>

//           <Link
//             className={`${getProfileLinkClass(
//               "/service_profile_info"
//             )} border-b pb-4 mb-2`}
//             href="/service_profile_info"
//           >
//             <RiUserSettingsFill className="text-[#115e59]" /> My Profile
//           </Link>

//           <button
//             className={`flex items-center gap-2 text-lg hover:bg-green-50 hover:text-[#115E59] px-3 py-2 rounded-md transition-colors ${isUpgrading ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             onClick={handleUpgradeAccount}
//             disabled={isUpgrading}
//           >
//             {isUpgrading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 mr-2 text-[#115E59]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 {multiUserverify ? "Switching..." : " Upgrading..."}
//               </>
//             ) : (
//               <>
//                 <MdAccountBox className="text-[#115E59]" /> {multiUserverify ? "Switch Profile" : " Upgrade Account"}
//               </>
//             )}
//           </button>

//           <button
//             className="flex items-center gap-2 text-lg hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-md transition-colors"
//             onClick={handleLogout}
//           >
//             <PiSignOutBold className="text-red-500" /> Sign Out
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Determine which dropdown to show based on role
//   const getDesktopProfileDropdown = () => {
//     if (role === "customer") return customerDesktopProfileDropdown;
//     if (role === "provider") return providerDesktopProfileDropdown;
//     return null;
//   };

//   const getMobileProfileDropdown = () => {
//     if (role === "customer") return customerMobileProfileDropdown;
//     if (role === "provider") return providerMobileProfileDropdown;
//     return null;
//   };

//   return (
//     <nav
//       className={`w-full bg-white shadow-sm sticky top-0 z-50 py-2 transform transition-transform duration-500 ${isVisible ? "translate-y-0" : "-translate-y-full"
//         }`}
//     >
//       <div className="max-w-[1240px] mx-auto px-6 py-3 flex items-center justify-between">
//         {/* Logo */}
//         <Link
//           href="/"
//           className={`flex items-center gap-2 transition duration-300 hover:scale-105 ${pathname === "/" ? "opacity-100" : "opacity-90 hover:opacity-100"
//             }`}
//         >
//           <Image
//             className="h-10 lg:h-12"
//             src={taskalleyLogo}
//             alt="TaskAlley Logo"
//             priority
//           />
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden lg:flex items-center gap-2">
//           {role === "guest" && guestLinks}
//           {role === "customer" && taskProviderLinks}
//           {role === "provider" && serviceProviderLinks}
//         </div>

//         {/* Right Side */}
//         <div className="hidden lg:flex items-center gap-4">
//           {role === "guest" ? guestAuthButtons : getDesktopProfileDropdown()}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="lg:hidden text-2xl text-[#115e59] hover:bg-[#115e59] hover:text-white p-2 cursor-pointer border border-[#115e59] hover:bg-opacity-10 rounded-md transition-colors"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? <MdClose /> : <MdMenu />}
//         </button>
//       </div>

//       {/*  Mobile Dropdown  */}
//       <div
//         className={`lg:hidden bg-white shadow-md px-6 overflow-hidden transition-all duration-500 border-t border-gray-100 ${isOpen ? "max-h-[700px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
//           }`}
//       >
//         {role === "guest" && (
//           <>
//             {guestLinks}
//             <div className="pt-4 border-t border-gray-100 mt-4">
//               {guestAuthButtons}
//             </div>
//           </>
//         )}
//         {(role === "customer" || role === "provider") && (
//           <>
//             {role === "customer" && taskProviderLinks}
//             {role === "provider" && serviceProviderLinks}
//             {getMobileProfileDropdown()}
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

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
                        {isMultiRole ? "Switch to Other Profile" : "Become a Service Provider"}
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
