"use client";

import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const FAQ_DATA = [
  {
    question: "How does the Escrow payment system work?",
    answer:
      "When you hire a provider, your payment is held securely by our platform. We only release the funds to the provider once you confirm that the task has been completed to your satisfaction.",
  },
  {
    question: "Is it free to post a task?",
    answer:
      "Yes! Posting a task is completely free. You only pay when you hire a provider, and the quoted price includes our small service commission.",
  },
  {
    question: "How are service providers verified?",
    answer:
      "Every provider must undergo a multi-step verification process, including government ID checks and portfolio reviews, before receiving a 'Verified' badge.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-[1240px] mx-auto px-6 py-20">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Left Side: Header */}
        <div className="w-full lg:w-1/3">
          <span className="text-[#115E59] font-bold text-sm uppercase tracking-widest">
            Support
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 mb-6">
            Frequently Asked <br /> Questions
          </h2>
          <p className="text-gray-600">
            Can't find what you're looking for? Reach out to our 24/7 support team.
          </p>
        </div>

        {/* Right Side: Accordion */}
        <div className="w-full lg:w-2/3 space-y-4">
          {FAQ_DATA.map((item, index) => (
            <div
              key={index}
              className={`border rounded-2xl transition-all duration-300 ${
                openIndex === index ? "border-[#115E59] bg-teal-50/30" : "border-gray-100 bg-white"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span
                  className={`font-bold text-lg ${
                    openIndex === index ? "text-[#115E59]" : "text-gray-900"
                  }`}
                >
                  {item.question}
                </span>
                {openIndex === index ? (
                  <FiMinus className="text-[#115E59] flex-shrink-0" />
                ) : (
                  <FiPlus className="text-gray-400 flex-shrink-0" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
