'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

// Assets
import image1 from '../../../public/image-1.svg';
import image2 from '../../../public/image-2.svg';
import image3 from '../../../public/image-3.svg';
import bg_image from '../../../public/shadow bg.svg';

const HeroSection = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  // Senior Practice: Extracting guard logic to a single function
  const protectedNavigation = (path, requiredRole = 'customer') => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      return;
    }
    if (user?.role !== requiredRole) {
      toast.error(`Please switch to a ${requiredRole} account to access this.`);
      return;
    }
    router.push(path);
  };

  return (
    <section className="relative max-w-[1240px] mx-auto px-2 pt-12 lg:pt-20 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Content */}
        <div className="flex flex-col gap-8 text-center lg:text-left z-10 w-full lg:w-1/2">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.15]">
              One Platform. <span className="text-[#115E59]">Every Service.</span> <br /> Zero
              Hassle.
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
              The most trusted marketplace for African professionals. Post tasks, receive bids, and
              hire locally with escrow security.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => protectedNavigation('/service-listing')}
              className="px-8 py-4 bg-[#115E59] text-white font-semibold rounded-xl hover:bg-[#0d4a46] transition-all duration-300 shadow-lg shadow-teal-900/20 active:scale-95"
            >
              Browse Services
            </button>
            <button
              onClick={() => protectedNavigation('/post_task')}
              className="px-8 py-4 border-2 border-[#115E59] text-[#115E59] font-semibold rounded-xl hover:bg-teal-50 transition-all duration-300 active:scale-95"
            >
              Post a Task
            </button>
          </div>

          {/* Trust Metric (New Senior Addition) */}
          <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
              ))}
            </div>
            <span>Joined by 10k+ skilled providers</span>
          </div>
        </div>

        {/* Right Visuals */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center">
          {/* Background Pattern - Absolute Positioning */}
          <div className="absolute -z-10 w-[120%] h-full opacity-40">
            <Image src={bg_image} alt="" fill className="object-contain" priority />
          </div>

          <div className="relative flex items-center gap-4 md:gap-6 group">
            <div className="flex flex-col gap-4 md:gap-6 transform transition-transform duration-700 group-hover:-translate-y-2">
              <Image
                src={image1}
                alt="Artisan"
                width={220}
                height={280}
                className="rounded-2xl shadow-2xl object-cover hover:scale-105 transition"
              />
              <Image
                src={image2}
                alt="Professional"
                width={220}
                height={280}
                className="rounded-2xl shadow-2xl object-cover hover:scale-105 transition"
              />
            </div>
            <div className="transform transition-transform duration-700 group-hover:translate-y-2">
              <Image
                src={image3}
                alt="Freelancer"
                width={220}
                height={400}
                className="rounded-2xl shadow-2xl object-cover hover:scale-105 transition"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
