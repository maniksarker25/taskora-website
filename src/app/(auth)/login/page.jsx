"use client";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"; // Using Lucide for cleaner icons
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { useLoginUserMutation } from "@/lib/features/auth/authApi";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { parseJwt } from "@/utils/auth";

import registration_img from "../../../../public/login_page_image.png";
import main_logo from "../../../../public/main_logo_svg.svg";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur", // Validates when user leaves the field
  });

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data).unwrap();

      if (result.success && result.data) {
        dispatch(
          setCredentials({
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
            isAddressProvided: result.data.isAddressProvided || false,
          })
        );

        const decoded = parseJwt(result.data.accessToken);
        const userRole = decoded?.role || "customer";

        // Logic Check: Direct users based on verification status
        if (!result.data.isAddressProvided) {
          router.push("/verify");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      console.log("Login Error:", err);
      const errorMessage = err?.data?.message || "Something went wrong. Please try again.";
      setServerError(errorMessage);
      // In a real app, use toast.error(err.data?.message)
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full flex bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100">
        {/* Left Side: Visual/Branding (Hidden on Mobile) */}
        <div className="hidden lg:block lg:w-1/2 relative bg-teal-900">
          <Image
            src={registration_img}
            alt="Welcome back"
            fill
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 to-transparent flex items-end p-12">
            <div>
              <h2 className="text-white text-3xl font-bold mb-2">Welcome Back!</h2>
              <p className="text-teal-100/80">
                Connect with local service providers and get things done faster.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <Link href="/" className="inline-block mb-10">
              <Image src={main_logo} alt="Company Logo" width={160} height={40} className="w-40" />
            </Link>

            <header className="mb-8">
              <h1 className="text-slate-900 text-3xl font-black tracking-tight mb-2">
                Login to Account
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Please enter your credentials to continue
              </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-slate-700 text-xs font-bold uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                    })}
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${
                      errors.email ? "border-red-400" : "border-slate-200"
                    } rounded-2xl outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all text-sm font-medium text-slate-700`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-slate-700 text-xs font-bold uppercase tracking-widest">
                    Password
                  </label>
                  <Link
                    href="/forgetpass"
                    className="text-xs font-bold text-teal-600 hover:text-teal-700"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                  <input
                    {...register("password", { required: "Password is required" })}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3.5 bg-slate-50 border ${
                      errors.password ? "border-red-400" : "border-slate-200"
                    } rounded-2xl outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all text-sm font-medium text-slate-700`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

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
                className="w-full bg-[#115E59] hover:bg-teal-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-bold">Or</span>
                </div>
              </div>

              <p className="text-center text-slate-500 text-sm font-medium">
                New here?{" "}
                <Link
                  href="/role"
                  className="text-teal-600 font-bold hover:underline underline-offset-4"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
