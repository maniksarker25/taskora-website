import Image from 'next/image'
import React from 'react'
import FooterBg from '../../../public/Ellipse_footer.svg'
import taskalleyLogo from "../../../public/Group (4).svg";
import facebook from "../../../public/facebook.svg";
import twitter from "../../../public/twitter.svg";
import youtube from "../../../public/youtube.svg";
import behanch from "../../../public/behanch.svg";
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black pt-20 pb-20 px-10 tracking-wide relative">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-wrap flex-col md:flex-row gap-16 justify-between">
          {/* first row */}
          <div className=" flex lg:flex flex-col lg:items-left gap-2 md:gap-5">
            <Link href="/">
              <Image src={taskalleyLogo} alt="logo"  />
            </Link>
            <a href="" className='text-white'>Phone: +012 (345) 678 99</a>
            <a href="" className='text-white'>Email: support@taskalley.com</a>
          </div>

          {/* second row */}

          <div>
            <h4 className="text-xl mb-4 text-white">Resources</h4>
            <ul className="space-y-2 md:space-y-4">
              <li>
                <Link href="/about" className="hover:text-slate-400 text-white text-sm">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-400 text-white text-sm">Contact Us</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-slate-400 text-white text-sm">FAQ</Link>
                
              </li>
              <li>
                <Link href="/sitesmap" className="hover:text-slate-400 text-white text-sm">Sitemap</Link>
                
              </li>
            </ul>
          </div>

           {/* third row */}
          <div>
            <h4 className="text-base mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 md:space-y-4">
              <li>
                <Link href="/" className="hover:text-slate-400 text-white text-sm">Home</Link>
              </li>
              <li>
                <Link href="/browseservice" className="hover:text-slate-400 text-white text-sm">Browse Services</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-400 text-white text-sm">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-400 text-white text-sm">Terms of Condition</Link>
              </li>
              
            </ul>
          </div>
           {/* fourth row */}
          <div className="lg:flex lg:flex-col">
            <ul className="flex space-x-6">
           
            <li>
              <a href='https://www.facebook.com/' className='transition transform duration-300 hover:scale-105'>
                <Image src={facebook} alt="Facebook" />
              </a>
            </li>
            <li>
              <a href='https://twitter.com/' className='transition transform duration-300 hover:scale-105'>
                <Image src={twitter} alt="Twitter" />
              </a>
            </li>
            <li>
              <a href='https://www.youtube.com/' className='transition transform duration-300 hover:scale-105'>
                <Image src={youtube} alt="YouTube" />
              </a>
            </li>
            <li>
              <a href='https://www.behance.net/' className='transition transform duration-300 hover:scale-105'>
                <Image src={behanch} alt="Behance" />
              </a>
            </li>
          </ul>
           {/* <p className="text-white text-sm mt-10">© 2023 Invitte.com
        </p> */}
          </div>
        </div>

      </div>
      <div className='absolute top-8 right-20'>
        <Image src={FooterBg} alt="Footer Background" />
      </div>
    </footer>
  )
}

export default Footer