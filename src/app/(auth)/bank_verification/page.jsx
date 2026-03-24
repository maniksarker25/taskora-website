"use client";
import { useAuth } from "@/components/auth/useAuth";
import { useCompleteIdentityVerificationMutation } from "@/lib/features/bankVerificationApi/bankVerificationApi";
import { ArrowLeft, Calendar, CheckCircle2, CreditCard, ShieldCheck, User } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import registration_img from "../../../../public/login_page_image.png";

const BankVerificationContent = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    id_number: "",
    identificationDocumentType: "BVN",
  });

  const [completeIdentityVerification, { isLoading }] = useCompleteIdentityVerificationMutation();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("data", JSON.stringify(formData));

      const result = await completeIdentityVerification(payload).unwrap();
      if (result) {
        toast.success("Identity verified successfully");
        setTimeout(() => {
          if (from === "linked_account") {
            router.push("/linked_account");
          } else if (user?.role === "provider") {
            router.push("/id_card_verify");
          } else {
            router.push("/");
          }
        }, 1200);
      }
    } catch (err) {
      const errorMessage = err.data?.message || "Identity verification failed";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-teal-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden grid lg:grid-cols-12 relative z-10">
        {/* Left Side: Visuals */}
        <div className="lg:col-span-5 bg-[#115E59] relative hidden lg:flex flex-col justify-between p-12">
          <div className="relative z-20">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-teal-200/60 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>

          <div className="relative z-20 text-white">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/10">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-4xl font-black leading-tight mb-6 uppercase tracking-tighter">
              Verify Your <br />
              <span className="text-teal-300">Bank Details.</span>
            </h2>
            <p className="text-teal-50/60 text-sm font-medium leading-relaxed max-w-xs">
              We use secure encryption to verify your BVN directly with the central database.
            </p>
          </div>

          <div className="absolute inset-0 group opacity-40">
            <Image src={registration_img} alt="Secure" fill className="object-cover grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#115E59] to-transparent" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-8 md:p-16">
          <div className="max-w-md mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
                BVN Verification
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Please enter your 11-digit BVN as it appears on your bank records.
              </p>

              {/* Test Data Indicator */}
              <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-amber-50 border border-amber-100 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                  Development Mode: Use{" "}
                  <span className="bg-amber-200/50 px-1.5 py-0.5 rounded text-amber-950 font-black">
                    22222222222
                  </span>
                </p>
              </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Alice"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#115E59] focus:bg-white transition-all text-sm font-bold text-slate-700"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Johnson"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#115E59] focus:bg-white transition-all text-sm font-bold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#115E59] focus:bg-white transition-all text-sm font-bold text-slate-700 [color-scheme:light]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  11-Digit BVN Number
                </label>
                <div className="relative">
                  <CreditCard
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="22222222222"
                    value={formData.id_number}
                    onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#115E59] focus:bg-white transition-all text-sm font-bold text-slate-700 tracking-[0.2em]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-[#115E59] hover:bg-teal-800 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-[1.5rem] font-black uppercase tracking-[0.25em] text-[11px] shadow-2xl shadow-teal-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 cursor-pointer h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying Securely...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Verify & Continue
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const BankVerification = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#115E59]"></div>
        </div>
      }
    >
      <BankVerificationContent />
    </Suspense>
  );
};

export default BankVerification;
