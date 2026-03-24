"use client";
import { useApplyReferralCodeMutation } from "@/lib/features/auth/authApi";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Gift, Ticket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import registration_img from "../../../../public/login_page_image.png";

const ReferalCode = () => {
  const router = useRouter();
  const [applyReferralCode, { isLoading }] = useApplyReferralCodeMutation();
  const { register, handleSubmit } = useForm();
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    const code = data.referal_code?.trim();

    if (!code) {
      toast.error("Please enter a referral code to apply");
      return;
    }

    try {
      const res = await applyReferralCode({ code }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Referral code applied successfully!");
        router.push("/");
      }
    } catch (error) {
      const errorMessage = error?.data?.message || "Something went wrong. Please try again.";
      setServerError(errorMessage);
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <section className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-100 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-12 bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative z-10">
        {/* Left Side: Branding & Promo */}
        <div className="lg:col-span-5 bg-[#115E59] relative hidden lg:flex flex-col justify-between p-16">
          <div className="relative z-20">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-teal-200/60 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Previous Step
            </button>
          </div>

          <div className="relative z-20">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10">
              <Gift className="text-white" size={28} />
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-6 uppercase tracking-tighter">
              Unlock Your <br />
              <span className="text-teal-300">Welcome Reward.</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-teal-50/70">
                <CheckCircle2 size={16} className="text-teal-400" />
                <span className="text-sm font-medium">10% OFF your first task</span>
              </div>
              <div className="flex items-center gap-3 text-teal-50/70">
                <CheckCircle2 size={16} className="text-teal-400" />
                <span className="text-sm font-medium">Up to ₦50 instant discount</span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 group opacity-40">
            <Image src={registration_img} alt="Rewards" fill className="object-cover grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#115E59] to-transparent" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-8 md:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-12">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
                Have a Referal Code?
              </h1>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                If a friend invited you, enter their code below to claim your first-task bonus.
              </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Referral Code
                </label>
                <div className="relative group">
                  <Ticket
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#115E59] transition-colors"
                    size={20}
                  />
                  <input
                    {...register("referal_code")}
                    type="text"
                    className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-[#115E59] focus:bg-white transition-all text-sm font-bold text-slate-700 tracking-widest placeholder:tracking-normal placeholder:font-medium uppercase"
                    placeholder="E.G. TASK-USER123"
                  />
                </div>
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

              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-[#115E59] hover:bg-teal-800 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-[1.5rem] font-black uppercase tracking-[0.25em] text-[11px] shadow-2xl shadow-teal-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
                >
                  {isLoading ? (
                    "Applying Code..."
                  ) : (
                    <>
                      Apply Code & Continue
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full py-4 text-slate-400 hover:text-[#115E59] font-black uppercase tracking-[0.2em] text-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Skip for now
                </button>
              </div>
            </form>

            <footer className="mt-20 flex items-center justify-center gap-2 text-slate-200">
              <div className="h-px w-8 bg-slate-100" />
              <span className="text-[9px] font-bold uppercase tracking-widest italic">
                TaskOra Community Rewards
              </span>
              <div className="h-px w-8 bg-slate-100" />
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferalCode;
