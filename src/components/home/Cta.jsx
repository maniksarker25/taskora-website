"use client"
import React from "react";
import { useSelector } from "react-redux";
import { useGetMyProfileQuery, useUpgradeAccountMutation } from "@/lib/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Cta = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const [upgradeAccount, { isLoading: isUpgrading }] = useUpgradeAccountMutation();
  const { data } = useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const multiUserverify = data?.data.user.isMultiRole;
  const userRole = user?.role;

  const handleUpgradeAccount = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      const result = await upgradeAccount().unwrap();
      const updatedData = result?.data;

      if (updatedData?.role === "provider") {
        if (!updatedData.isAddressProvided) {
          router.push("/verify");
          return;
        }

        if (!updatedData.isBankNumberVerified) {
          router.push("/bank_verification");
          return;
        }

        if (!updatedData.isIdentificationDocumentVerified) {
          router.push("/id_card_verify");
          return;
        }

        router.push("/");
      } else if (updatedData?.role === "customer") {
        router.push("/");
      }

      if (result?.success) {
        toast.success(result.message || "Account updated successfully");
      }

    } catch (error) {
      toast.error(error?.data?.message || "Account update failed");
    }
  };

  const buttonLabel = multiUserverify
    ? (userRole === "customer" ? "Switch to Freelancer" : "Switch to Tasker")
    : (userRole === "customer" ? "Join as a Freelancer" : "Join as a Tasker");

  const loadingLabel = multiUserverify ? "Switching..." : "Upgrading...";

  return (
    <section className="pt-24 pb-24 gradiant-bg">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-12 ">
          {/* Text Section */}
          <div className="flex flex-col gap-4 text-center lg:text-left max-w-2xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug">
              Ready to Grow Your Service Business?
            </h3>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl">
              <span className="font-bold text-black">
                {buttonLabel} on Taskalley —
              </span>{" "}
              showcase your skills, reach more clients, and manage bookings with
              ease — all in one platform designed to help your business thrive.
            </p>
          </div>

          {/* Button */}
          <div className="flex justify-center lg:justify-end w-full lg:w-auto">
            <button
              onClick={handleUpgradeAccount}
              disabled={isUpgrading}
              className="px-6 py-3 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 text-lg font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUpgrading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {loadingLabel}
                </>
              ) : (
                buttonLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
