// import Image from "next/image";

import { Image } from "lucide-react";

// const HowWorkCard = ({ item }) => {
//   return (
//     <div className="relative shadow-md rounded-lg p-4 flex flex-col items-start hover:shadow-lg transition transform duration-300 hover:scale-105 cursor-pointer pl-8 py-8 gap-4 bg-white overflow-hidden">
//       {/* Gradient Overlay (background decoration only) */}
//       <div className="absolute top-18 right-0 w-[60px] h-[300px] bg-gradient-to-b from-[#c0d5d4] to-white rotate-130"></div>

//       <div className="absolute top-0 right-0 w-[60px] h-[300px] bg-gradient-to-b from-[#e3f3f3] to-white rotate-130"></div>
//       <div className="absolute top-36 right-0 w-[60px] h-[300px] bg-gradient-to-b from-[#72a8a8] to-white rotate-130"></div>

//       {/* Content */}
//       <div className="relative z-10 flex flex-col gap-4">
//         <Image src={item.icon} alt={item.cateName} />
//         <h4 className="text-2xl font-medium">{item.cateName}</h4>
//         <p>{item.providers}</p>
//       </div>
//     </div>
//   );
// };

// export default HowWorkCard;

// inside @/sharred/HowWorkCard
const HowWorkCard = ({ item }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center group">
      <div className="w-20 h-20 mb-6 bg-teal-50 rounded-2xl flex items-center justify-center group-hover:bg-[#115E59] transition-colors duration-500">
        <Image
          src={item.icon}
          alt={item.cateName}
          width={48}
          height={48}
          className="group-hover:brightness-0 group-hover:invert transition-all duration-500"
        />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-3">{item.cateName}</h4>
      <p className="text-gray-500 leading-relaxed text-sm md:text-base">{item.providers}</p>
    </div>
  );
};

export default HowWorkCard;
