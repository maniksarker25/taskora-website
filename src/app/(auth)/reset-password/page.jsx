"use client";
import registration_img from "../../../../public/login_page_image.png";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useResetPasswordMutation } from "@/lib/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const router = useRouter();

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    useEffect(() => {
        const storedPhone = localStorage.getItem("forgetPasswordPhone");
        const storedOtp = localStorage.getItem("forgetPasswordOtp");
        if (storedPhone) setPhone(storedPhone);
        if (storedOtp) setOtp(storedOtp);

        if (!storedPhone || !storedOtp) {
            toast.error("Session expired. Please try again.");
            router.push("/forgetpass");
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            const result = await resetPassword({
                phone: phone,
                resetCode: Number(otp),
                password: password,
                confirmPassword: confirmPassword
            }).unwrap();

            if (result.success) {
                toast.success("Password reset successfully!", {
                    style: {
                        backgroundColor: "#d1fae5",
                        color: "#065f46",
                        borderLeft: "6px solid #10b981",
                    },
                });

                // Clear sensitive info from localStorage
                localStorage.removeItem("forgetPasswordPhone");
                localStorage.removeItem("forgetPasswordOtp");
                localStorage.removeItem("forgetPasswordEmail");

                router.push("/login");
            }
        } catch (err) {
            console.error("Reset password failed:", err);
            toast.error(err?.data?.message || "Failed to reset password. Please try again.", {
                style: {
                    backgroundColor: "#fee2e2",
                    color: "#991b1b",
                    borderLeft: "6px solid #dc2626",
                },
            });
        }
    };

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

                    {/* Right Side - Form */}
                    <div className="flex w-full items-center">
                        <div className="w-full">
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="w-full p-6 sm:p-8">
                                    <h1 className="text-[#394352] text-3xl font-semibold my-4 text-center">
                                        Reset Password
                                    </h1>
                                    <p className="text-[#1F2937] text-center mb-8">
                                        Please enter your new password below
                                    </p>

                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        {/* New Password */}
                                        <div>
                                            <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                                                New Password
                                            </label>
                                            <div className="relative flex items-center">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-10 rounded-md outline-[#115E59]"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                                                Confirm Password
                                            </label>
                                            <div className="relative flex items-center">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-10 rounded-md outline-[#115E59]"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex w-full text-center rounded-sm overflow-clip transition transform duration-300 hover:scale-101">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="bg-[#115E59] w-full py-3 text-white cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                                            >
                                                {isLoading ? "Resetting..." : "Reset Password"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
