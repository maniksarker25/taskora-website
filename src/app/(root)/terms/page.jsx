"use client"
import React from 'react'
import contact_man from "../../../../public/contact_man.svg";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../src/components/ui/breadcrumb";
import Image from "next/image";
import { useGetTermsConditionsQuery } from '@/lib/features/web/termsApi';

const Terms = () => {
  const { data, isLoading } = useGetTermsConditionsQuery();
  const termsContent = data?.data?.description;

  return (
    <section className="pb-16 ">
      {/* Hero Section */}
      <div className="bg-[#e6f4f1] mb-8 lg:mb-20">
        <div>
          <div className=" project_container flex flex-col gap-8 lg:flex-row justify-between items-center ">
            {/* left side */}
            <div className="flex flex-col pt-10 lg:pt-0">
              <h3 className="text-2xl lg:text-4xl font-semibold mb-5">
                Terms and Conditions{" "}
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
                        Terms and Conditions
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
      {/* Terms Content */}
      <div className="project_container px-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#115E59]"></div>
          </div>
        ) : (
          <div
            className="prose max-w-none text-base text-[#2B2B2B]"
            dangerouslySetInnerHTML={{ __html: termsContent }}
          />
        )}
      </div>
    </section>
  )
}

export default Terms;