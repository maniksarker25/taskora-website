"use client";

import HowWorkCard from "@/sharred/HowWorkCard";
import Image from "next/image";

// Assets
import connectorLine from "../../../public/bg-line.svg";
import stepIcon1 from "../../../public/Frame (8).svg";
import { default as stepIcon2, default as stepIcon3 } from "../../../public/hand.svg";
import sectionIcon from "../../../public/popularcate.svg";

const STEPS_DATA = [
  {
    id: 1,
    title: "Create Your Account",
    description: "Sign up as a tasker or freelancer directly on our website.",
    icon: stepIcon1,
  },
  {
    id: 2,
    title: "Find or List a Service",
    description: "Taskers can browse services by category, location, or price.",
    icon: stepIcon2,
  },
  {
    id: 3,
    title: "Book & Connect Securely",
    description: "Confirm bookings, chat in real-time, and make secure payments.",
    icon: stepIcon3,
  },
];

const HowWorks = () => {
  return (
    <section className="relative max-w-[1240px] mx-auto px-6 py-16 md:py-24 overflow-hidden">
      <div className="flex flex-col gap-12 md:gap-20">
        {/* Section Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Image src={sectionIcon} alt="" width={20} height={20} className="opacity-90" />
            </div>
            <span className="text-[#115E59] font-bold tracking-[0.2em] text-xs uppercase">
              How it works
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Getting Started is <span className="text-[#115E59]">Easy</span>
          </h2>
        </header>

        {/* Process Flow Container */}
        <div className="relative">
          {/* Decorative Background Line - Only visible on Desktop */}
          {/* Senior Tip: Use pointer-events-none so the image doesn't block clicks */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 hidden lg:block pointer-events-none z-0">
            <Image src={connectorLine} alt="" className="w-full object-contain opacity-60" />
          </div>

          {/* Steps Grid - Using <ol> for semantic sequential steps */}
          <ol className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            {STEPS_DATA.map((step, index) => (
              <li key={step.id} className="list-none">
                <div className="relative group">
                  {/* Optional: Step Number Badge (Very Senior Design Touch) */}
                  <div className="absolute -top-4 -left-2 w-8 h-8 bg-white border-2 border-[#115E59] text-[#115E59] rounded-full flex items-center justify-center font-bold text-sm shadow-sm z-20 group-hover:bg-[#115E59] group-hover:text-white transition-colors duration-300">
                    {index + 1}
                  </div>

                  <HowWorkCard
                    item={{
                      ...step,
                      // Mapping our clean data keys to the component's expected props
                      cateName: step.title,
                      providers: step.description,
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Visual background blob for professional feel */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default HowWorks;
