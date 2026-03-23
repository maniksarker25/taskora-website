"use client";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Assets
import customerIcon from "../../../../public/customer.svg";
import registration_img from "../../../../public/login_page_image.png";
import main_logo from "../../../../public/main_logo_svg.svg";
import providerIcon from "../../../../public/service_providers.svg";

const RoleSelection = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/register?role=${selectedRole}`);
    }
  };

  const roles = [
    {
      id: "customer",
      title: "Tasker",
      description: "I want to hire professionals for my tasks.",
      icon: customerIcon,
      accent: "teal",
    },
    {
      id: "provider",
      title: "Freelancer",
      description: "I want to offer my services and earn.",
      icon: providerIcon,
      accent: "indigo",
    },
  ];

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full flex bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 min-h-[600px]">
        {/* Left Side: Visual Branding */}
        <div className="hidden lg:block lg:w-1/2 relative bg-[#115E59]">
          <Image
            src={registration_img}
            alt="Onboarding"
            fill
            priority
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062e2b] via-transparent to-transparent p-12 flex flex-col justify-end">
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
              Join Our Community
            </h2>
            <p className="text-teal-100/80 font-medium">
              Select your path and start your journey with us today.
            </p>
          </div>
        </div>

        {/* Right Side: Role Selection Logic */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="flex justify-center mb-10">
              <Image src={main_logo} alt="Logo" width={160} height={40} className="w-40" />
            </div>

            <div className="text-center mb-10">
              <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                How will you use the platform?
              </h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Choose the role that best describes your needs. You can always switch later.
              </p>
            </div>

            {/* Role Cards */}
            <div className="space-y-4 mb-10">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full group relative flex items-center gap-5 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                    selectedRole === role.id
                      ? "border-[#115E59] bg-teal-50/50 ring-4 ring-teal-500/5"
                      : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl transition-colors cursor-pointer ${
                      selectedRole === role.id
                        ? "bg-[#115E59]"
                        : "bg-slate-100 group-hover:bg-slate-200"
                    }`}
                  >
                    <Image
                      src={role.icon}
                      alt={role.title}
                      width={48}
                      height={48}
                      className={`w-10 h-10 ${
                        selectedRole === role.id ? "brightness-0 invert" : ""
                      }`}
                    />
                  </div>

                  <div className="flex-1 cursor-pointer">
                    <h3
                      className={`font-black uppercase tracking-widest text-xs mb-1 ${
                        selectedRole === role.id ? "text-[#115E59]" : "text-slate-400"
                      }`}
                    >
                      {role.title}
                    </h3>
                    <p className="text-slate-600 text-[11px] font-medium leading-tight">
                      {role.description}
                    </p>
                  </div>

                  {selectedRole === role.id && (
                    <CheckCircle2 className="w-6 h-6 text-[#115E59] animate-in zoom-in duration-300" />
                  )}
                </button>
              ))}
            </div>

            {/* Action Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                selectedRole
                  ? "bg-[#115E59] text-white hover:bg-teal-800 shadow-teal-900/20 active:scale-[0.98]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              Get Started
              <ArrowRight
                className={`w-4 h-4 transition-transform duration-300 ${
                  selectedRole ? "translate-x-1" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;
