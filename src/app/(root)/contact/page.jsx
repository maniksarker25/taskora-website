
import React from "react";
import contact_man from "../../../../public/contact_man.svg";
import { ImFacebook2 } from "react-icons/im";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { BsWhatsapp } from "react-icons/bs";


import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../src/components/ui/breadcrumb";
import Image from "next/image";
import Link from "next/link";

const Contact = () => {
  return (
    <section className="">
      {/* Hero Section */}
      <div className="bg-[#e6f4f1] mb-8 lg:mb-20">
        <div>
          <div className=" project_container flex flex-col gap-8 lg:flex-row justify-between items-center ">
            {/* left side */}
            <div className="flex flex-col pt-10 lg:pt-0">
              <h3 className="text-2xl lg:text-4xl font-semibold mb-5">
                Contact Us{" "}
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
                        Contact
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

      <div className="flex project_container bg-[#E6F4F1] ">
        <div
          className="h-100% w-[650px] relative hidden lg:flex"
          style={{
            backgroundImage: "url('/contact_page.svg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
             <div className="absolute bottom-20 left-7">
                 <p className="text-white font-base pb-2">Follow Us On</p>
                 <div className="flex gap-3 items-center">
                    <Link href={"https://www.facebook.com/"} className="text-white text-xl"><ImFacebook2 /></Link>
                    <Link href={"https://x.com/"} className="text-white text-2xl"><FaSquareXTwitter /></Link>
                    <Link href={"https://www.linkedin.com/"} className="text-white text-2xl"><FaLinkedin /></Link>
                    <Link href={"https://www.instagram.com/"} className="text-white text-3xl"><RiInstagramFill /></Link>
                    <Link href={"https://www.whatsapp.com/"} className="text-white text-2xl"><BsWhatsapp /></Link>
                 </div>
             </div>
        </div>


        <div className="p-8 lg:p-20">
           <h3 className="text-4xl font-semibold text-center lg:text-start">Taskalley  <span className="text-[#E5B92E]"></span></h3>

           <p className="text-base font-semibold text-[#111928] text-center lg:text-start mt-8">Reach out to our team anytime — whether it's a query about subscriptions, technical support, or partnership opportunities.</p>


           <form className="mt-12" >
                {/* name */}

                <label className="block text-base mb-2 mt-2">Full Name</label>
                <input type="text" name="name" placeholder="Full Name"  className="bg-white border-none w-full py-2 px-2 rounded-md" />
                {/* name */}

                <label className="block text-base mb-2 mt-2">Email Address</label>
                <input type="email" name="email" placeholder="Email Address"  className="bg-white border-none w-full py-2 px-2 rounded-md"/>
                {/* name */}

                <label className="block text-base mb-2 mt-2">Phone Number</label>
                <input type="number" name="phone" placeholder="Phone Number"  className="bg-white border-none w-full py-2 px-2 rounded-md"/>
                {/* name */}

                <label className="block text-base mb-2 mt-2">Description </label>
                <textarea type="text" name="des" placeholder="Type Your Message"  className="bg-white border-none w-full py-2 px-2 pb-24 rounded-md"/>

                  <button
                href="/register"
                className="px-14 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-[#115e59] transition transform duration-300 hover:scale-105 cursor-pointer mt-4"
              >
                Submit 
              </button>
               
           </form>
        </div>
      </div>
      <div className="py-8 lg:py-20"></div>
    </section>
  );
};

export default Contact;
