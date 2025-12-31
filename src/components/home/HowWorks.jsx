import Image from "next/image";
import React from "react";
import popularcateIcon from "../../../public/popularcate.svg";
import bgline from "../../../public/bg-line.svg";
import cateimg1 from "../../../public/Frame (8).svg";
import cateimg2 from "../../../public/hand.svg";
import service3 from "../../../public/hand.svg";
import HowWorkCard from "@/sharred/HowWorkCard";

const data = [
  {
    id: 1,
    cateName: "Create Your Account",
    providers:
      "Sign up as a tasker or freelancer directly on our website.",
    icon: cateimg1,
  },
  {
    id: 2,
    cateName: "Find or List a Service",
    providers: "Tasker can browse services by category, location, or price.",
    icon: cateimg2,
  },
  {
    id: 3,
    cateName: "Book & Connect Securely",
    providers: "Confirm bookings, chat in real-time, and make secure payments.",
    icon: service3,
  },
];

const HowWorks = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-4 mb-20 md:mb-20 lg:mb-0 ">
      <div className="flex flex-col gap-16">
        <div className="mt-16 md:mt-20 flex flex-col gap-5 md:flex-row justify-between md:items-center">
          {/* top header */}
          <div>
            <div className="flex items-center gap-4 ">
              <Image
                src={popularcateIcon}
                alt="Popular Category "
                height={24}
              />
              <p className="font-semibold text-md md:text-xl text-color pb-3">
                Taskalley
              </p>
            </div>
            <h3 className="font-semibold text-2xl md:text-4xl flex flex-col gap-6">
              How It Works
            </h3>
          </div>

          
        </div>

        {/* gradient color */}
        <div className="relative w-full min-h-[500px] md:min-h-[600px]">
          {/* Background Line Image */}
          <div className="absolute -top-32 left-0 right-0 mx-auto w-full h-full hidden lg:flex items-center justify-center z-0">
            <Image src={bgline} alt="Background Line" />
          </div>

          {/* Cards Grid */}
          <div className="relative z-10 w-full px-4 md:px-0 md:pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-24">
            {data.map((item, index) => (
              <HowWorkCard key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWorks;
