// app/congratulations/CongratulationsContent.jsx
"use client"
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CongratulationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Payment Successful!");
  const [buttonText, setButtonText] = useState("Back to Home");
  const [buttonLink, setButtonLink] = useState("/");
  const [countdown, setCountdown] = useState(3);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      setMessage(`Your order #${orderIdParam} has been placed successfully! We'll send you an email with the order details.`);
      setButtonText("View Order Details");
      setButtonLink(`/profile/orders/${orderIdParam}`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (orderId) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [orderId, router]);

  return (
    <div className="flex min-h-screen ">
      {/* Main Content - Centered */}
      <div className="w-full flex items-center justify-center p-4 md:p-8">
        <div className="max-w-2xl w-full bg-white  rounded-3xl border border-[#329790] shadow-2xl overflow-hidden">
          <div className="">
            {/* Left Content Section */}
            <div className="w-full p-8 md:p-12  ">
              <div className="text-center lg:text-left">
                {/* Success Icon */}
                <div className="flex justify-center items-center lg:justify-center mb-6 ">
                  <div className="relative text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-[#115e59] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    {/* Animated rings */}
                    <div className="absolute inset-0 border-2 border-[#115e59] rounded-full animate-ping" />
                    <div className="absolute inset-0 border-2 border-[#115e59]/20 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-3xl font-bold text-black mb-4 text-center">
                  Congratulations!
                </h1>

                {/* Message */}
                <p className="text-black text-lg mb-8 leading-relaxed text-center">
                  {message}
                </p>

              

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={buttonLink} className="flex-1">
                    <button className="w-full bg-[#115e59] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-[#115e59]/25 cursor-pointer">
                      {buttonText}
                    </button>
                  </Link>
                 
                </div>

               
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-75" />
      </div>
    </div>
  );
}