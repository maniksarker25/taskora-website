"use client"
import registration_img from "../../../../public/login_page_image.png";
import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useCompleteIdentityVerificationMutation } from "@/lib/features/bankVerificationApi/bankVerificationApi";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/useAuth";
import { useRouter, useSearchParams } from "next/navigation";


const BankVerificationContent = () => {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    id_number: "",
    identificationDocumentType: "BVN",
  });
  const [completeIdentityVerification, { isLoading, error, data }] = useCompleteIdentityVerificationMutation();
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("data", JSON.stringify(formData));

      const result = await completeIdentityVerification(payload).unwrap();
      console.log("API Response Success:", result);

      if (result) {
        toast.success("Identity verification completed successfully")
        setTimeout(() => {
          if (from === "linked_account") {
            router.push("/linked_account");
          } else if (user?.role === 'provider') {
            router.push('/id_card_verify');
          } else {
            router.push('/');
          }
        }, 1000);

      }
    } catch (err) {
      console.error("Error Details:", err);
      const errorMessage = err.data?.message || err.message || "Identity verification failed";
      toast.error(errorMessage);
    }
  };


  React.useEffect(() => {
    if (error) {
      console.log("Error state updated:", error);
    }
    if (data) {
      console.log("Data state updated:", data);
    }
  }, [error, data]);

  return (
    <section className="">
      <div className="max-w-[1100px] mx-auto h-[1200px] flex items-center justify-center max-h-screen">
        <div className="flex items-center justify-center gap-8 bg-[#F8FAFC] rounded-sm overflow-clip md:shadow-2xl">
          {/* Left Side - Images */}
          <div className="hidden md:block overflow-hidden w-full h-full">
            <div className="w-auto">
              <Image
                src={registration_img}
                alt="Worker"
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Right Side - Role Selection */}
          <div className="flex w-full items-center">
            <div>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-full">
                  <div className="p-6 sm:p-8">
                    <h1 className="text-[#394352] text-3xl font-semibold my-4">
                      Verify Your BVN
                    </h1>
                    <p className="text-[#1F2937]">
                      Enter your 11-digit Bank Verification Number (BVN) for identity confirmation.
                    </p>

                    {/* -------------------form------------------------------ */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                            First Name
                          </label>
                          <input
                            name="first_name"
                            type="text"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                            placeholder="Alice"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                            Last Name
                          </label>
                          <input
                            name="last_name"
                            type="text"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                            placeholder="Johnson"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                            Date of Birth
                          </label>
                          <input
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 [color-scheme:light]"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                            BVN Number
                          </label>
                          <input
                            name="id_number"
                            type="text"
                            value={formData.id_number}
                            onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                            placeholder="Enter 11-digit BVN"
                            required
                          />
                        </div>
                      </div>



                      {/* Submit Button */}
                      <div className="mt-4 rounded-sm overflow-clip transition transform duration-300 hover:scale-101">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`bg-[#115E59] w-full py-3 text-white cursor-pointer rounded-md ${(isLoading)
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#0e4d49]"
                            }`}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Verifying...
                            </span>
                          ) : (
                            "Verify BVN"
                          )}
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

const BankVerification = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115E59]"></div>
      </div>
    }>
      <BankVerificationContent />
    </Suspense>
  );
};

export default BankVerification;