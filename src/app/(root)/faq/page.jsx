"use client"
import React, { useState } from 'react'
import contact_man from "../../../../public/contact_man.svg";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../src/components/ui/breadcrumb";
import Image from 'next/image';
import { useGetFaqQuery } from '@/lib/features/web/faqApi';

const faqs = [
  {
    question: "Can I contact business owners directly ?",
    answer:
      "Yes, once you’re signed in, you can message sellers directly through their listing page.",
  },
  {
    question: "Can I contact business owners directly ?",
    answer:
      "Yes, we ship worldwide. Shipping costs vary depending on your location.",
  },
  {
    question: "What filters can I use to search for businesses ?",
    answer:
      "Once your order is shipped, you will receive an email with the tracking details.",
  },
  {
    question: "How do I save or bookmark listings I'm interested in ??",
    answer:
      "Once your order is shipped, you will receive an email with the tracking details.",
  },
  {
    question: "Can I compare multiple businesses at once ?",
    answer:
      "Once your order is shipped, you will receive an email with the tracking details.",
  },
  {
    question: "How do I request more information from a seller ?",
    answer:
      "Once your order is shipped, you will receive an email with the tracking details.",
  },
  {
    question: "Are there fees for buyers?",
    answer:
      "Once your order is shipped, you will receive an email with the tracking details.",
  },
  {
    question: "What filters can I use to search for businesses ?",
    answer:
      "Once your order is shipped, you will receive an email with the tracking details.",
  },
  {
    question: "What filters can I use to search for businesses ?",
    answer:
      "Once your order is shipped, you will receive an email with the tracking details.",
  },
];


const Faq = () => {

  const [openIndex, setOpenIndex] = useState(null);
  const { data: faqs, isLoading } = useGetFaqQuery();
  const faqData = faqs?.data;
  console.log("faqqq=>", faqData)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className='mb-16'>
         {/* Hero Section */}
      <div className="bg-[#e6f4f1] mb-8 lg:mb-20">
        <div>
          <div className=" project_container flex flex-col gap-8 lg:flex-row justify-between items-center ">
            {/* left side */}
            <div className="flex flex-col pt-10 lg:pt-0">
              <h3 className="text-2xl lg:text-4xl font-semibold mb-5">
                FAQ{" "}
              </h3>
              <div>
                <Breadcrumb>
                  <BreadcrumbList>
                    {/* Home link */}
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="/"
                        className="
                    font-semibold lg:text-base"
                      >
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>

                    {/* Separator */}
                    <BreadcrumbSeparator className="text-base" />

                    {/* Current page */}
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-[#0EA5E9] font-semibold lg:text-base">
                        FAQ
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            {/* right side */}
            <div>
              <Image
                src={contact_man}
                alt="hero contact image"
                className="lg:h-96 
              pr-24 lg:pr-0 "
              />
            </div>
          </div>
        </div>
      </div>



      <section className="project_container p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
      <div className="space-y-10 ">
        {faqData?.map((faq, index) => (
          <div
            key={index}
            className="border-b-1  border-black bg-white"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-4 py-3 text-left text-lg font-medium cursor-pointer"
            >
              {faq.question}
              {openIndex === index ? (
                <FaChevronUp className="text-[#115e59] transition-transform duration-300" />
              ) : (
                <FaChevronDown className="text-[#115e59] transition-transform duration-300" />
              )}
            </button>
            <div
              className={`px-4 overflow-hidden transition-all duration-500 ${
                openIndex === index ? "max-h-40 py-2" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
    </section>
  )
}

export default Faq