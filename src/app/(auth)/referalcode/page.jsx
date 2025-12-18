"use client";
import registration_img from "../../../../public/login_page_image.png";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApplyReferralCodeMutation } from "@/lib/features/auth/authApi";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ReferalCode = () => {
  const router = useRouter();
  const [applyReferralCode, { isLoading }] = useApplyReferralCodeMutation();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    // If input is empty, just treat as skip or do nothing? User flow says apply code.
    // If purely empty, maybe show error or just skip? 
    // Assuming button is explicitly "Apply Code", it should probably validate non-empty.
    // But let's check current behavior. 

    const code = data.referal_code?.trim();

    if (!code) {
      toast.error("Please enter a referral code");
      return;
    }

    try {
      const res = await applyReferralCode({ code }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Referral code applied successfully!");
        router.push("/");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to apply referral code");
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <section className="">
      <div className="max-w-[1100px] mx-auto h-[1200px] flex items-center justify-center max-h-screen  ">
        <div className="flex items-center justify-center gap-8 bg-[#F8FAFC] rounded-sm overflow-clip md:shadow-2xl">
          {/* Left Side - Images */}
          <div className="hidden md:block overflow-hidden w-full h-full">
            <div className="w-auto ">
              <Image
                src={registration_img}
                alt="Worker"
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Right Side - Role Selection */}
          <div className="flex w-full items-center ">
            <div>
              <div className=" flex flex-col items-center justify-center py-6 ">
                <div className="w-full">
                  <div className="p-6 sm:p-8 ">
                    <h1 className="text-[#394352] text-3xl font-semibold my-4">
                      Have a Referral Code? Unlock Your Reward
                    </h1>
                    <p className="text-[#1F2937]">
                      Apply a referral code and get 10% OFF your first task – up
                      to ₦50!
                    </p>
                    {/* -------------------form------------------------------ */}
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                          Referral Code (Optional)
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("referal_code")}
                            type="text"
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Enter referral code here (e.g., TASK-USER123)"
                          />
                        </div>
                      </div>

                      <div className="mt-4 w-full rounded-sm overflow-clip transition transform duration-300 hover:scale-101">
                        <div className="flex text-center">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#115E59] w-full py-2 text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                          >
                            {isLoading ? "Applying..." : "Apply Code & Continue"}
                          </button>
                        </div>
                      </div>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={handleSkip}
                          className="text-center px-6 py-2 text-[#115e59] border-1 border-[#115e59] w-full rounded-md hover:bg-[#115e59] hover:text-white transition transform duration-300"
                        >
                          Skip & Continue Without Code
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferalCode;
