"use client";

const PARTNERS = [
  { name: "Paystack", logo: "/logos/paystack.svg" },
  { name: "Flutterwave", logo: "/logos/flutterwave.svg" },
  { name: "Airtel Money", logo: "/logos/airtel.svg" },
];

const TrustBar = () => {
  return (
    <div className="w-full bg-gray-50/50 py-10 my-10 border-y border-gray-100">
      <div className="max-w-[1240px] mx-auto px-6">
        <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
          Secure Payments Powered By
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {PARTNERS.map((partner) => (
            <div key={partner.name} className="h-8 md:h-10 relative w-32 md:w-40">
              {/* Replace with your actual logo paths */}
              <div className="flex items-center justify-center font-bold text-xl text-gray-400">
                {partner.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
