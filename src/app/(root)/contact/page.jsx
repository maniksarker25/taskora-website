"use client";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BsWhatsapp } from "react-icons/bs";
import { FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";
import { ImFacebook2 } from "react-icons/im";
import { RiInstagramFill } from "react-icons/ri";

import contact_man from "../../../../public/contact_man.svg";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../src/components/ui/breadcrumb";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for form submission
  };

  return (
    <section className="bg-white">
      {/* Header / Hero Section */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4">
              Get in Touch
            </h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    className="font-bold text-slate-400 hover:text-[#115e59] transition-colors"
                  >
                    HOME
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#115e59] font-black uppercase tracking-wider">
                    CONTACT
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="relative w-full max-w-sm lg:max-w-md">
            <Image
              src={contact_man}
              alt="contact illustration"
              className="w-full h-auto drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          {/* Left Side: Contact Info & Branding */}
          <div className="lg:w-[400px] bg-[#115e59] p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-6 leading-tight">
                Contact <br />
                Information
              </h2>
              <p className="text-teal-100/70 text-sm mb-12 font-medium">
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-sm">+012 (345) 678 99</span>
                </div>
                <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-sm">hello@taskalley.com</span>
                </div>
                <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-sm leading-snug">
                    123 Marketplace Street, <br /> Dhaka, Bangladesh
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-16 lg:mt-0 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-200/50 mb-4">
                Follow Us
              </p>
              <div className="flex gap-4">
                {[
                  { icon: ImFacebook2, link: "https://facebook.com" },
                  { icon: FaSquareXTwitter, link: "https://x.com" },
                  { icon: FaLinkedin, link: "https://linkedin.com" },
                  { icon: RiInstagramFill, link: "https://instagram.com" },
                  { icon: BsWhatsapp, link: "https://whatsapp.com" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.link}
                    className="p-2.5 bg-white/10 rounded-lg hover:bg-white hover:text-[#115e59] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <item.icon className="text-lg" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-10 lg:p-16">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
              Send a Message
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-10">
              We'd love to hear from you. Let's start a conversation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#115e59] focus:ring-4 focus:ring-teal-500/5 transition-all text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#115e59] focus:ring-4 focus:ring-teal-500/5 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+000 000 0000"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#115e59] focus:ring-4 focus:ring-teal-500/5 transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us what you're thinking..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#115e59] focus:ring-4 focus:ring-teal-500/5 transition-all text-sm font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full lg:w-auto px-10 py-4 bg-[#115e59] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-teal-900/20 hover:bg-teal-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
