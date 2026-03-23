"use client";
import Image from "next/image";
import Link from "next/link";

// Assets
import FooterBg from "../../../public/Ellipse_footer.svg";
import taskalleyLogo from "../../../public/Group (4).svg";
import behanch from "../../../public/behanch.svg";
import facebook from "../../../public/facebook.svg";
import twitter from "../../../public/twitter.svg";
import youtube from "../../../public/youtube.svg";

// Icons (Lucide-react for a cleaner feel, optional but recommended)
import { ArrowUpRight, Mail, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    resources: [
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Sitemap", href: "/sitesmap" },
    ],
    quickLinks: [
      { name: "Home", href: "/" },
      { name: "Browse Services", href: "/browseservice" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Condition", href: "/terms" },
    ],
    socials: [
      { icon: facebook, alt: "Facebook", href: "https://facebook.com" },
      { icon: twitter, alt: "Twitter", href: "https://twitter.com" },
      { icon: youtube, alt: "YouTube", href: "https://youtube.com" },
      { icon: behanch, alt: "Behance", href: "https://behance.net" },
    ],
  };

  return (
    <footer className="bg-[#020617] pt-24 pb-12 px-6 lg:px-12 relative overflow-hidden border-t border-slate-900">
      {/* Abstract Background Glow */}
      <div className="absolute top-0 right-0 opacity-40 pointer-events-none -translate-y-1/2 translate-x-1/4">
        <Image src={FooterBg} alt="Glow Effect" className="w-[600px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image src={taskalleyLogo} alt="TaskAlley Logo" className="w-44" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The leading marketplace for verified local service providers and taskers.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+01234567899"
                className="flex items-center gap-3 text-slate-300 hover:text-teal-500 transition-colors text-sm group"
              >
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-teal-500/10 transition-colors">
                  <Phone size={16} />
                </div>
                +012 (345) 678 99
              </a>
              <a
                href="mailto:support@taskalley.com"
                className="flex items-center gap-3 text-slate-300 hover:text-teal-500 transition-colors text-sm group"
              >
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-teal-500/10 transition-colors">
                  <Mail size={16} />
                </div>
                support@taskalley.com
              </a>
            </div>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">
              Resources
            </h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-all text-sm flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-[1px] bg-teal-500 mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-all text-sm flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-[1px] bg-teal-500 mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter Column */}
          <div>
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">
              Connect With Us
            </h4>
            <div className="flex space-x-4 mb-8">
              {footerLinks.socials.map((social) => (
                <a
                  key={social.alt}
                  href={social.href}
                  target="_blank"
                  className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center transition-all hover:bg-[#115E59] hover:border-teal-400 hover:-translate-y-1"
                >
                  <Image src={social.icon} alt={social.alt} className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <p className="text-xs font-bold text-white mb-2">Join the waitlist</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Email"
                  className="bg-black text-xs p-2 rounded-lg w-full border border-slate-800 outline-none focus:border-teal-500"
                />
                <button className="bg-[#115E59] p-2 rounded-lg">
                  <ArrowUpRight size={14} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs font-medium">
            © {currentYear} TaskAlley. All rights reserved. Built by{" "}
            <span className="text-slate-300">Ahamic Solution</span>.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-slate-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-black"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-slate-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-black"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-slate-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-black"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
