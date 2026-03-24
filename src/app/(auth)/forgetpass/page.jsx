'use client';
import { ArrowLeft, Loader2, ShieldQuestion } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import { toast } from 'sonner';

// Assets & Logic
import { useForgetPasswordMutation } from '@/lib/features/auth/authApi';
import registration_img from '../../../../public/login_page_image.png';

// Styles
import 'react-phone-number-input/style.css';

const ForgetPassword = () => {
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please enter your phone number');
      return;
    }

    try {
      const result = await forgetPassword({ phone }).unwrap();
      if (result.success) {
        localStorage.setItem('forgetPasswordPhone', phone);
        if (result.data?.email) {
          localStorage.setItem('forgetPasswordEmail', result.data.email);
        }
        toast.success('OTP sent successfully', {
          style: {
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderLeft: '6px solid #10b981',
          },
        });
        router.push('/verifyotp');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to send OTP. Please try again.', {
        style: {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderLeft: '6px solid #dc2626',
        },
      });
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full flex bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 min-h-[600px]">
        {/* Left Side - Illustration */}
        <div className="hidden lg:block lg:w-1/2 relative bg-[#115E59]">
          <Image
            src={registration_img}
            alt="Security Illustration"
            fill
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062e2b] via-transparent to-transparent p-12 flex flex-col justify-end">
            <h2 className="text-white text-3xl font-black uppercase tracking-tight mb-2">
              Secure Your Account
            </h2>
            <p className="text-teal-100/80 font-medium">
              We'll help you get back into your account in just a few steps.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-[#115E59]">
                <ShieldQuestion className="w-8 h-8" />
              </div>
              <h1 className="text-slate-900 text-3xl font-black uppercase tracking-tight mb-3">
                Forgot Password?
              </h1>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Enter your registered phone number below. We will send you a 6-digit verification
                code.
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="phone-input-premium">
                  <PhoneInput
                    international
                    defaultCountry="NG"
                    countries={['NG', 'CA', 'GB', 'US', 'BD']}
                    value={phone}
                    onChange={setPhone}
                    className="w-full flex px-4 py-1 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-[#115E59] focus-within:ring-4 focus-within:ring-teal-500/5 transition-all"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#115E59] hover:bg-teal-800 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-teal-900/20 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
