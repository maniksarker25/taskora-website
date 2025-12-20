"use client";
import registration_img from "../../../../public/login_page_image.png";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useVerifyUserCodeMutation } from "@/lib/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const VerifyUserCode = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();

  const [verifyUserCode, { isLoading, isError, error, isSuccess }] = useVerifyUserCodeMutation();

  useEffect(() => {
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputRefs.current.indexOf(e.target);
      if (index > 0) {
        setOtp((prevOtp) => [
          ...prevOtp.slice(0, index - 1),
          "",
          ...prevOtp.slice(index),
        ]);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (target.value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please sign up again.");
      return;
    }

    const verifyCode = otp.join("");

    try {
      const result = await verifyUserCode({
        email: email,
        verifyCode: parseInt(verifyCode)
      }).unwrap();

      toast.success("Account verified successfully!");
      localStorage.removeItem('email');

      const isAddressProvided = result.data?.isAddressProvided || result.isAddressProvided;
      if (isAddressProvided) {
        router.push("/");
      } else {
        router.push("/verify");
      }
    } catch (err) {
      console.error("Failed to verify user code:", err);
      toast.error(err?.data?.message || "Invalid verification code. Please try again.");
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    // Add your resend code logic here
    setTimeout(() => {
      toast.success("Verification code sent successfully!");
      setIsResending(false);
    }, 2000);
  };

  const isOtpComplete = otp.every(digit => digit !== "");

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white py-8 px-4">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Image Section */}
          <div className="lg:w-1/2 w-full h-64 lg:h-auto overflow-hidden">
            <div className="w-full h-full">
              <Image
                src={registration_img}
                alt="Verification Illustration"
                className="w-full h-full object-cover lg:object-center"
                priority
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:w-1/2 w-full p-6 sm:p-8 lg:p-12">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
                  Verify Your Account
                </h1>
                <p className="text-gray-600 mb-2">
                  Enter the 6-digit verification code sent to your provided phone number
                </p>

              </div>

              {/* OTP Input Section */}
              <div className="mb-8">
                <form id="otp-form" className="flex justify-center gap-3 sm:gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      onFocus={handleFocus}
                      onPaste={handlePaste}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center text-center text-2xl sm:text-3xl font-bold text-gray-800 bg-white border-2 border-gray-300 rounded-xl focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59] outline-none transition-all duration-200 shadow-sm"
                    />
                  ))}
                </form>
              </div>

              {/* Verify Button */}
              <div className="mb-6">
                <button
                  onClick={handleVerify}
                  disabled={isLoading || !isOtpComplete || !email}
                  className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Verify Account</span>
                    </>
                  )}
                </button>
              </div>

              {/* Resend Code Section */}
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                >
                  {isResending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="#115E59" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-[#115E59]">Resend Verification Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyUserCode;