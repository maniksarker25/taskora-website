import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import client from "../../../public/profile_image.jpg";
import { CgProfile } from "react-icons/cg";
import { IoIosNotifications } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { TbDiscount } from "react-icons/tb";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";
import { useSelector } from "react-redux";
import { useGetMyProfileQuery, useUpdateProfileMutation } from "@/lib/features/auth/authApi";
import { FaCamera } from "react-icons/fa6";
import { toast } from "sonner";

const sidebarLinks = [
  { name: "Profile Info", href: "/profile_info", icon: <CgProfile /> },
  {
    name: "Notifications",
    href: "/notifications",
    icon: <IoIosNotifications />,
  },
  { name: "My Transactions", href: "/transaction", icon: <FaMoneyBillTransfer /> },
  // { name: "Manage Account", href: "/manage_account_task_poster", icon: <MdManageAccounts /> },
  {
    name: "Security Settings",
    href: "/security_settings",
    icon: <IoIosSettings />,
  },
  { name: "Referrals & Discounts", href: "/refer_discounts", icon: <TbDiscount /> },
  // { name: "Home", href: "/", icon: <FaHome /> },
];

const ProfileSideNav = ({ open, onClose }) => {
  const pathname = usePathname();
  const { data, isLoading, error } = useGetMyProfileQuery();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const fileInputRef = useRef(null);

  const userData = data?.data;
  console.log("user info", userData)

  // Function to determine if link is active and return appropriate classes
  const getLinkClass = (href) => {
    const isActive = pathname === href;

    return isActive
      ? "group px-3 py-4 flex items-center gap-3 rounded-lg bg-[#115E59] text-white font-semibold transition w-64 shadow-md"
      : "group px-3 py-4 flex items-center gap-3 rounded-lg border border-[#b8d3cd] text-[#115E59] font-medium hover:bg-[#115E59] hover:text-white transition w-64";
  };

  // Function to get icon color based on active state
  const getIconClass = (href) => {
    const isActive = pathname === href;
    return isActive ? "text-white" : "group-hover:text-white";
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_image", file);

      try {
        const result = await updateProfile(formData).unwrap();
        if (result.success) {
          toast.success("Profile image updated successfully!");
        }
      } catch (error) {
        console.error("Failed to update profile image:", error);
        toast.error(error?.data?.message || "Failed to update profile image");
      }
    }
  };

  return (
    <div
      className={`fixed md:relative top-0 left-0 min-h-full rounded-l-lg bg-[#E6F4F1] shadow-lg z-40 transform transition-transform duration-300 mt-20 md:mt-20 lg:mt-0
               ${open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
    >
      <div className="flex flex-col items-center py-6 gap-2">
        {/* Profile Image */}
        <div className="relative w-24 h-24 group cursor-pointer" onClick={handleImageClick}>
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md">
            <Image
              src={userData?.profile_image || client}
              alt="profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Edit Badge / Loading Overlay */}
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 transition-transform hover:scale-110">
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-[#115E59] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaCamera className="text-[#115E59] text-sm" />
            )}
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <h2 className="font-semibold text-gray-800">{userData?.name}</h2>
        <p className="text-xs text-gray-600">{user?.role === "customer" ? "Tasker" : "Freelancer"}</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={getLinkClass(link.href)}
            onClick={() => {
              if (onClose) {
                onClose();
              }
            }}
          >
            <span className={getIconClass(link.href)}>{link.icon}</span>
            {link.name}
          </Link>
        ))}
      </nav>

    </div>
  );
};

export default ProfileSideNav;