// "use client";
// import { useVerifyUserCodeMutation } from "@/lib/features/auth/authApi";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { toast } from "sonner";
// import registration_img from "../../../../public/login_page_image.png";

// const VerifyUserCode = () => {
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const [email, setEmail] = useState("");
//   const [isResending, setIsResending] = useState(false);
//   const inputRefs = useRef([]);
//   const router = useRouter();

//   const [verifyUserCode, { isLoading, isError, error, isSuccess }] = useVerifyUserCodeMutation();

//   useEffect(() => {
//     const userEmail = localStorage.getItem("email");
//     if (userEmail) {
//       setEmail(userEmail);
//     }
//   }, []);

//   const handleKeyDown = (e) => {
//     if (
//       !/^[0-9]{1}$/.test(e.key) &&
//       e.key !== "Backspace" &&
//       e.key !== "Delete" &&
//       e.key !== "Tab" &&
//       !e.metaKey
//     ) {
//       e.preventDefault();
//     }

//     if (e.key === "Delete" || e.key === "Backspace") {
//       const index = inputRefs.current.indexOf(e.target);
//       if (index > 0) {
//         setOtp((prevOtp) => [...prevOtp.slice(0, index - 1), "", ...prevOtp.slice(index)]);
//         inputRefs.current[index - 1].focus();
//       }
//     }
//   };

//   const handleInput = (e) => {
//     const { target } = e;
//     const index = inputRefs.current.indexOf(target);
//     if (target.value) {
//       setOtp((prevOtp) => [...prevOtp.slice(0, index), target.value, ...prevOtp.slice(index + 1)]);
//       if (index < otp.length - 1) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleFocus = (e) => {
//     e.target.select();
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const text = e.clipboardData.getData("text");
//     if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
//       return;
//     }
//     const digits = text.split("");
//     setOtp(digits);
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();

//     if (!email) {
//       toast.error("Email not found. Please sign up again.");
//       return;
//     }

//     const verifyCode = otp.join("");

//     try {
//       const result = await verifyUserCode({
//         email: email,
//         verifyCode: parseInt(verifyCode),
//       }).unwrap();

//       toast.success("Account verified successfully!");
//       localStorage.removeItem("email");

//       const isAddressProvided = result.data?.isAddressProvided || result.isAddressProvided;
//       if (isAddressProvided) {
//         router.push("/");
//       } else {
//         router.push("/verify");
//       }
//     } catch (err) {
//       console.error("Failed to verify user code:", err);
//       toast.error(err?.data?.message || "Invalid verification code. Please try again.");
//     }
//   };

//   const handleResendCode = async () => {
//     setIsResending(true);
//     // Add your resend code logic here
//     setTimeout(() => {
//       toast.success("Verification code sent successfully!");
//       setIsResending(false);
//     }, 2000);
//   };

//   const isOtpComplete = otp.every((digit) => digit !== "");

//   return (
//     <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white py-8 px-4">
//       <div className="max-w-6xl w-full mx-auto">
//         <div className="flex flex-col lg:flex-row items-center justify-center bg-white rounded-2xl shadow-2xl overflow-hidden">
//           {/* Image Section */}
//           <div className="lg:w-1/2 w-full h-64 lg:h-auto overflow-hidden">
//             <div className="w-full h-full">
//               <Image
//                 src={registration_img}
//                 alt="Verification Illustration"
//                 className="w-full h-full object-cover lg:object-center"
//                 priority
//               />
//             </div>
//           </div>

//           {/* Form Section */}
//           <div className="lg:w-1/2 w-full p-6 sm:p-8 lg:p-12">
//             <div className="max-w-md mx-auto w-full">
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
//                   Verify Your Account
//                 </h1>
//                 <p className="text-gray-600 mb-2">
//                   Enter the 6-digit verification code sent to your provided phone number
//                 </p>
//               </div>

//               {/* OTP Input Section */}
//               <div className="mb-8">
//                 <form id="otp-form" className="flex justify-center gap-3 sm:gap-4">
//                   {otp.map((digit, index) => (
//                     <input
//                       key={index}
//                       type="text"
//                       inputMode="numeric"
//                       maxLength={1}
//                       value={digit}
//                       onChange={handleInput}
//                       onKeyDown={handleKeyDown}
//                       onFocus={handleFocus}
//                       onPaste={handlePaste}
//                       ref={(el) => (inputRefs.current[index] = el)}
//                       className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center text-center text-2xl sm:text-3xl font-bold text-gray-800 bg-white border-2 border-gray-300 rounded-xl focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59] outline-none transition-all duration-200 shadow-sm"
//                     />
//                   ))}
//                 </form>
//               </div>

//               {/* Verify Button */}
//               <div className="mb-6">
//                 <button
//                   onClick={handleVerify}
//                   disabled={isLoading || !isOtpComplete || !email}
//                   className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 flex items-center justify-center gap-3"
//                 >
//                   {isLoading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span>Verifying...</span>
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         className="w-5 h-5"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M5 13l4 4L19 7"
//                         />
//                       </svg>
//                       <span>Verify Account</span>
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Resend Code Section */}
//               <div className="text-center">
//                 <p className="text-gray-600 mb-4">Didn't receive the code?</p>
//                 <button
//                   type="button"
//                   onClick={handleResendCode}
//                   disabled={isResending}
//                   className="text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
//                 >
//                   {isResending ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
//                       <span>Sending...</span>
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-4 h-4" fill="none" stroke="#115E59" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                         />
//                       </svg>
//                       <span className="text-[#115E59]">Resend Verification Code</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default VerifyUserCode;

"use client";
import { useVerifyUserCodeMutation } from "@/lib/features/auth/authApi";
import { ArrowLeft, CheckCircle2, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import registration_img from "../../../../public/login_page_image.png";

const VerifyUserCode = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [activeBox, setActiveBox] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();

  const [verifyUserCode, { isLoading }] = useVerifyUserCodeMutation();

  useEffect(() => {
    const userEmail = typeof window !== "undefined" ? localStorage.getItem("email") : null;
    if (userEmail) setEmail(userEmail);
  }, []);

  const handleChange = (value, index) => {
    // Only allow numbers
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move focus forward
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
      setActiveBox(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        setActiveBox(index - 1);
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Session expired. Please sign up again.");

    const code = otp.join("");
    if (code.length < 6) return toast.error("Please enter the full 6-digit code.");

    try {
      const result = await verifyUserCode({
        email,
        verifyCode: parseInt(code),
      }).unwrap();

      toast.success("Security clearance granted!");
      localStorage.removeItem("email");

      // Redirect based on address status
      const target = result.data?.isAddressProvided ? "/" : "/verify";
      router.push(target);
    } catch (err) {
      toast.error(err?.data?.message || "Verification failed. Check your code.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-100 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-12 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative z-10">
        {/* Left: Brand Context (Hidden on Mobile) */}
        <div className="lg:col-span-5 bg-[#115E59] relative hidden lg:flex flex-col justify-between p-16">
          <div className="relative z-20">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-teal-200/60 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Entry
            </button>
          </div>

          <div className="relative z-20">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10">
              <Lock className="text-white" size={24} />
            </div>
            <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 uppercase tracking-tighter">
              Verify <br /> <span className="text-teal-300">Identity.</span>
            </h2>
            <p className="text-teal-50/60 text-sm font-medium leading-relaxed max-w-xs">
              TaskOra uses high-level encryption. Please enter the code sent to your registered
              contact.
            </p>
          </div>

          <div className="absolute inset-0 group overflow-hidden opacity-50">
            <Image
              src={registration_img}
              alt="Security"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#115E59] via-[#115E59]/60 to-transparent" />
          </div>
        </div>

        {/* Right: OTP Form Section */}
        <div className="lg:col-span-7 p-8 md:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <h3 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tight">
                Enter Code
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                Verification sent to:{" "}
                <span className="text-[#115E59] font-bold">
                  {email || "active-user@taskora.com"}
                </span>
              </p>

              {/* Development Mode Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-2xl animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute inset-0" />
                  <div className="w-2 h-2 rounded-full bg-amber-600 relative" />
                </div>
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-[0.1em]">
                  Staging Mode: Use{" "}
                  <span className="bg-amber-200/50 px-1.5 py-0.5 rounded text-amber-950">
                    111111
                  </span>
                </p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-10">
              {/* OTP Grid */}
              <div className="flex justify-between gap-2 sm:gap-4">
                {otp.map((digit, index) => (
                  <div key={index} className="relative group flex-1">
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onFocus={() => setActiveBox(index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onChange={(e) => handleChange(e.target.value, index)}
                      className={`w-full h-16 sm:h-20 text-center text-3xl font-black rounded-[1.25rem] border-2 transition-all duration-300 outline-none
                        ${
                          activeBox === index
                            ? "border-[#115E59] bg-white shadow-[0_20px_40px_-12px_rgba(17,94,89,0.15)] -translate-y-1"
                            : "border-slate-100 bg-slate-50/50 text-slate-400"
                        }
                        ${digit ? "border-teal-600/30 bg-teal-50/30 text-[#115E59]" : ""}
                      `}
                    />
                    {activeBox === index && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#115E59] rounded-full animate-pulse" />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <button
                  type="submit"
                  disabled={isLoading || otp.includes("")}
                  className="w-full py-5 bg-[#115E59] hover:bg-teal-800 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-[1.25rem] font-black uppercase tracking-[0.25em] text-[11px] shadow-2xl shadow-teal-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.97] cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Verify Security Code
                    </>
                  )}
                </button>

                <div className="flex flex-col items-center gap-5 pt-4">
                  <div className="h-px w-12 bg-slate-100" />
                  <button
                    type="button"
                    disabled={isResending}
                    onClick={() => {
                      setIsResending(true);
                      setTimeout(() => {
                        toast.success("Security code re-dispatched!");
                        setIsResending(false);
                      }, 2000);
                    }}
                    className="group flex items-center gap-2 text-[#115E59] font-black text-[10px] uppercase tracking-[0.2em] hover:text-teal-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw
                      size={14}
                      className={
                        isResending
                          ? "animate-spin"
                          : "group-hover:rotate-180 transition-transform duration-700"
                      }
                    />
                    {isResending ? "Processing Dispatch..." : "Request New Code"}
                  </button>
                </div>
              </div>
            </form>

            <footer className="mt-20 flex items-center justify-center gap-2 text-slate-300">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                TaskOra Secure Gateway
              </span>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VerifyUserCode;
