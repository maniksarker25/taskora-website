// "use client";
// import { useRegisterMutation } from "@/lib/features/auth/authApi";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useState } from "react";
// import { useForm } from "react-hook-form";
// import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import { toast } from "sonner";
// import registration_img from "../../../../public/login_page_image.png";
// import main_logo from "../../../../public/main_logo_svg.svg";

// const RegisterContent = () => {
//   const searchParams = useSearchParams();
//   const role = searchParams.get("role") || "customer";
//   const router = useRouter();
//   const [phoneValue, setPhoneValue] = useState("");
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//     clearErrors,
//   } = useForm();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [registerUser, { isLoading }] = useRegisterMutation();

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const validatePhoneNumber = (value) => {
//     if (!value) {
//       return "Phone number is required";
//     }
//     if (!isValidPhoneNumber(value)) {
//       return "Please enter a valid phone number";
//     }
//     return true;
//   };

//   const onSubmit = async (formData) => {
//     try {
//       const phoneValidation = validatePhoneNumber(phoneValue);
//       if (phoneValidation !== true) {
//         setError("phone", {
//           type: "manual",
//           message: phoneValidation,
//         });
//         return;
//       }

//       // Validate passwords match
//       if (formData.password !== formData.confirmPassword) {
//         setError("confirmPassword", {
//           type: "manual",
//           message: "Passwords do not match",
//         });
//         return;
//       }

//       // Prepare data for API
//       const registrationData = {
//         name: formData.name,
//         email: formData.email,
//         phone: phoneValue,
//         password: formData.password,
//         confirmPassword: formData.confirmPassword,
//         role: role,
//       };

//       // Call register API
//       const result = await registerUser(registrationData).unwrap();

//       if (result.success) {
//         localStorage.setItem("email", formData.email);

//         toast.success("Registration successful! Please check your phone to verify your account.", {
//           style: {
//             backgroundColor: "#d1fae5",
//             color: "#065f46",
//             borderLeft: "6px solid #10b981",
//           },
//         });

//         router.push("/verify_register_user");
//       }
//     } catch (err) {
//       console.error("Registration failed:", err);
//       toast.error(err?.data?.message || "Registration failed. Please try again.", {
//         style: {
//           backgroundColor: "#fee2e2",
//           color: "#991b1b",
//           borderLeft: "6px solid #dc2626",
//         },
//       });
//     }
//   };

//   const handlePhoneChange = (value) => {
//     setPhoneValue(value);

//     if (value) {
//       clearErrors("phone");
//     }
//   };

//   return (
//     <section className="overflow-y-scroll">
//       <div className="max-w-7xl mx-auto flex items-center justify-center max-h-screen mt-12 mb-12 ">
//         <div className="flex items-center justify-center gap-8 bg-[#F8FAFC] rounded-sm overflow-clip shadow-2xl">
//           {/* Left Side - Images */}
//           <div className="hidden md:block overflow-hidden w-full h-full">
//             <div className="w-auto ">
//               <Image src={registration_img} alt="Worker" className="w-[600px] object-cover" />
//             </div>
//           </div>

//           {/* Right Side - Role Selection */}
//           <div className="flex w-full items-center ">
//             <div>
//               <div className=" flex flex-col items-center justify-center py-2 ">
//                 <div className="w-full">
//                   <div className="p-6 sm:p-8 ">
//                     <Link href="/" className="flex justify-center items-center mb-12">
//                       <Image src={main_logo} alt="main_logo" className="w-44" />
//                     </Link>
//                     <h1 className="text-[#394352] text-3xl font-semibold my-4">
//                       Create Your Account
//                     </h1>
//                     <p className="text-[#1F2937]">
//                       Sign up with your email and phone number to get started.
//                     </p>
//                     {/* -------------------form------------------------------ */}
//                     <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-2">
//                       {/* name */}
//                       <div>
//                         <label className="text-[#1F2937] text-sm font-medium mb-1 block">
//                           Full Name
//                         </label>
//                         <div className="relative flex items-center">
//                           <input
//                             {...register("name", {
//                               required: "Full name is required",
//                               minLength: {
//                                 value: 2,
//                                 message: "Name must be at least 2 characters",
//                               },
//                             })}
//                             name="name"
//                             type="text"
//                             className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600 focus:border-blue-500"
//                             placeholder="Write your name here"
//                           />
//                         </div>
//                         {errors.name && (
//                           <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
//                         )}
//                       </div>
//                       {/* email */}

//                       <div>
//                         <label className="text-[#1F2937] text-sm font-medium mb-1 block">
//                           Email address
//                         </label>
//                         <div className="relative flex items-center">
//                           <input
//                             {...register("email", {
//                               required: "Email is required",
//                               pattern: {
//                                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                                 message: "Invalid email address",
//                               },
//                             })}
//                             name="email"
//                             type="email"
//                             className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600 focus:border-blue-500"
//                             placeholder="Email address"
//                           />
//                         </div>
//                         {errors.email && (
//                           <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//                         )}
//                       </div>

//                       {/* phone */}

//                       <div>
//                         <label className="text-[#1F2937] text-sm font-medium mb-1 block">
//                           Phone Number
//                         </label>
//                         <div className="relative flex items-center">
//                           <PhoneInput
//                             international
//                             defaultCountry="NG"
//                             countries={["NG", "CA", "GB", "US"]}
//                             value={phoneValue}
//                             onChange={handlePhoneChange}
//                             className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-10 rounded-md outline-blue-600 focus:border-blue-500 outline-none"
//                           />
//                         </div>
//                         {errors.phone && (
//                           <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
//                         )}
//                       </div>

//                       {/* password */}
//                       <div>
//                         <label className="text-[#1F2937] text-sm font-medium mb-1 block">
//                           Password
//                         </label>
//                         <div className="relative flex items-center">
//                           <input
//                             {...register("password", {
//                               required: "Password is required",
//                               minLength: {
//                                 value: 6,
//                                 message: "Password must be at least 6 characters",
//                               },
//                             })}
//                             name="password"
//                             type={showPassword ? "text" : "password"}
//                             className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-10 rounded-md outline-blue-600 focus:border-blue-500"
//                             placeholder="Enter password"
//                           />
//                           <button
//                             type="button"
//                             onClick={togglePasswordVisibility}
//                             className="absolute right-3 p-1 focus:outline-none"
//                           >
//                             {showPassword ? (
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 strokeWidth={1.5}
//                                 stroke="currentColor"
//                                 className="w-5 h-5 text-slate-500"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
//                                 />
//                               </svg>
//                             ) : (
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 strokeWidth={1.5}
//                                 stroke="currentColor"
//                                 className="w-5 h-5 text-slate-500"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                               </svg>
//                             )}
//                           </button>
//                         </div>
//                         {errors.password && (
//                           <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//                         )}
//                       </div>

//                       {/* confirm pass */}
//                       <div>
//                         <label className="text-[#1F2937] text-sm font-medium block">
//                           Confirm Password
//                         </label>
//                         <div className="relative flex items-center">
//                           <input
//                             {...register("confirmPassword", {
//                               required: "Please confirm your password",
//                             })}
//                             name="confirmPassword"
//                             type={showConfirmPassword ? "text" : "password"}
//                             className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-10 rounded-md outline-blue-600 focus:border-blue-500"
//                             placeholder="Confirm password"
//                           />
//                           <button
//                             type="button"
//                             onClick={toggleConfirmPasswordVisibility}
//                             className="absolute right-3 p-1 focus:outline-none"
//                           >
//                             {showConfirmPassword ? (
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 strokeWidth={1.5}
//                                 stroke="currentColor"
//                                 className="w-5 h-5 text-slate-500"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
//                                 />
//                               </svg>
//                             ) : (
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 strokeWidth={1.5}
//                                 stroke="currentColor"
//                                 className="w-5 h-5 text-slate-500"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                               </svg>
//                             )}
//                           </button>
//                         </div>
//                         {errors.confirmPassword && (
//                           <p className="text-red-500 text-sm mt-1">
//                             {errors.confirmPassword.message}
//                           </p>
//                         )}
//                       </div>

//                       {/* dont have an account */}

//                       <p className="text-[#6B7280] text-base !mt-1">
//                         Already have an account?{" "}
//                         <Link
//                           href="/login"
//                           className="text-[#115E59] hover:underline ml-1 whitespace-nowrap font-semibold"
//                         >
//                           Sign In
//                         </Link>
//                       </p>

//                       <div className="mt-4 rounded-sm overflow-clip transition transform duration-300 hover:scale-101 flex">
//                         <button
//                           type="submit"
//                           disabled={isLoading}
//                           className={`${
//                             isLoading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-[#0e4d49]"
//                           } bg-[#115E59] py-3 text-white cursor-pointer w-full text-center font-medium text-base transition-colors duration-300`}
//                         >
//                           {isLoading ? (
//                             <span className="flex items-center justify-center">
//                               <svg
//                                 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <circle
//                                   className="opacity-25"
//                                   cx="12"
//                                   cy="12"
//                                   r="10"
//                                   stroke="currentColor"
//                                   strokeWidth="4"
//                                 ></circle>
//                                 <path
//                                   className="opacity-75"
//                                   fill="currentColor"
//                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                 ></path>
//                               </svg>
//                               Processing...
//                             </span>
//                           ) : (
//                             "Create Account"
//                           )}
//                         </button>
//                       </div>
//                     </form>
//                     {/* social login */}
//                     {/* <p className="text-[#6B7280] font-semibold mt-2">
//                       Or continue with
//                     </p>
//                     <div className="mt-4 flex gap-6">
//                       <button
//                         type="button"
//                         className="border-1 border-[#115E59] p-3.5 rounded-sm transition transform duration-300 hover:scale-101 cursor-pointer hover:bg-gray-50"
//                       >
//                         <FcGoogle className="text-2xl " />
//                       </button>
//                       <button
//                         type="button"
//                         className="border-1 border-[#115E59] p-3.5 rounded-sm transition transform duration-300 hover:scale-101 cursor-pointer hover:bg-gray-50"
//                       >
//                         <FaApple className="text-2xl text-[#115e59]" />
//                       </button>
//                     </div> */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const Register = () => (
//   <Suspense
//     fallback={
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115E59]"></div>
//       </div>
//     }
//   >
//     <RegisterContent />
//   </Suspense>
// );

// export default Register;
"use client";
import { useRegisterMutation } from "@/lib/features/auth/authApi";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import registration_img from "../../../../public/login_page_image.png";
import main_logo from "../../../../public/main_logo_svg.svg";

const RegisterContent = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "customer";
  const router = useRouter();
  const [phoneValue, setPhoneValue] = useState("");
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validatePhoneNumber = (value) => {
    if (!value) return "Phone number is required";
    if (!isValidPhoneNumber(value)) return "Please enter a valid phone number";
    return true;
  };

  const onSubmit = async (formData) => {
    try {
      const phoneValidation = validatePhoneNumber(phoneValue);
      if (phoneValidation !== true) {
        setError("phone", { type: "manual", message: phoneValidation });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("confirmPassword", { type: "manual", message: "Passwords do not match" });
        return;
      }

      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: phoneValue,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: role,
      };

      const result = await registerUser(registrationData).unwrap();

      if (result.success) {
        localStorage.setItem("email", formData.email);
        toast.success("Registration successful! Verify your account.", {
          style: { backgroundColor: "#d1fae5", color: "#065f46", borderLeft: "6px solid #10b981" },
        });
        router.push("/verify_register_user");
      }
    } catch (err) {
      const errorMessage = err?.data?.message || "Something went wrong. Please try again.";
      setServerError(errorMessage);
    }
  };

  const handlePhoneChange = (value) => {
    setPhoneValue(value);
    if (value) clearErrors("phone");
  };

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100">
        {/* Left Side - Image (Refined) */}
        <div className="hidden lg:block lg:w-1/2 relative bg-[#115E59]">
          <Image
            src={registration_img}
            alt="Worker"
            fill
            priority
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062e2b] to-transparent p-12 flex flex-col justify-end">
            <h2 className="text-white text-3xl font-black uppercase tracking-tight mb-2">
              Start Your Journey
            </h2>
            <p className="text-teal-100/80 font-medium">
              Join thousands of professionals and customers today.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 overflow-y-auto max-h-[95vh]">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-10">
              <Link href="/">
                <Image src={main_logo} alt="Logo" width={160} height={40} className="w-40" />
              </Link>
            </div>

            <header className="mb-8 text-center lg:text-left">
              <h1 className="text-slate-900 text-3xl font-black tracking-tight mb-2 uppercase">
                Create Account
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Sign up as a <span className="text-[#115E59] font-bold capitalize">{role}</span> to
                get started.
              </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#115E59] transition-colors" />
                  <input
                    {...register("name", {
                      required: "Full name is required",
                      minLength: { value: 2, message: "Min 2 characters" },
                    })}
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/5 transition-all text-sm font-medium text-slate-700 ${
                      errors.name ? "border-red-400" : "border-slate-200 focus:border-[#115E59]"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#115E59] transition-colors" />
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                    })}
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/5 transition-all text-sm font-medium text-slate-700 ${
                      errors.email ? "border-red-400" : "border-slate-200 focus:border-[#115E59]"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="phone-container">
                  <PhoneInput
                    international
                    defaultCountry="NG"
                    value={phoneValue}
                    onChange={handlePhoneChange}
                    className={`flex w-full px-4 py-1 bg-slate-50 border rounded-2xl transition-all ${
                      errors.phone
                        ? "border-red-400"
                        : "border-slate-200 focus-within:border-[#115E59]"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Password & Confirm Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#115E59] transition-colors" />
                    <input
                      {...register("password", {
                        required: "Required",
                        minLength: { value: 6, message: "Min 6 chars" },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      className={`w-full pl-11 pr-10 py-3.5 bg-slate-50 border rounded-2xl outline-none transition-all text-sm ${
                        errors.password
                          ? "border-red-400"
                          : "border-slate-200 focus:border-[#115E59]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Confirm
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword", { required: "Required" })}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••"
                      className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl outline-none transition-all text-sm ${
                        errors.confirmPassword
                          ? "border-red-400"
                          : "border-slate-200 focus:border-[#115E59]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] font-bold ml-1">
                  {errors.confirmPassword.message}
                </p>
              )}

              <p className="text-center text-slate-500 text-sm font-medium pt-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#115E59] font-black hover:underline underline-offset-4"
                >
                  Sign In
                </Link>
              </p>

              {serverError && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-red-500 p-1 rounded-full">
                    <AlertCircle className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-red-600 text-xs font-bold uppercase tracking-tight">
                    {serverError}
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-[#115E59] hover:bg-teal-800 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-teal-900/10 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 text-xs"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Register = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#115E59]" />
      </div>
    }
  >
    <RegisterContent />
  </Suspense>
);

export default Register;
