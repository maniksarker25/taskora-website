// "use client"

// import Image from "next/image";
// import React from "react";
// import popularcateIcon from "../../../public/popularcate.svg";
// import Link from "next/link";
// import righArrowIcon from "../../../public/whitearrow.svg";
// import CateCard from "@/sharred/CateCard";
// import { useGetAllCategoriesQuery } from "@/lib/features/category/categoryApi";

// const PopularCategory = () => {
//     const { data, isLoading, error } = useGetAllCategoriesQuery();
//     const category = data?.data?.result
//   return (
//     <section className="max-w-[1240px] mx-auto px-4">
//       <div className="flex flex-col gap-16">
//         <div className="mt-16 md:mt-44 flex flex-col gap-5 md:flex-row justify-between md:items-center">
//           {/* top header */}
//           <div>
//             <div className="flex items-center gap-4 ">
//               <Image
//                 src={popularcateIcon}
//                 alt="Popular Category "
//                 height={24}
//               />
//               <p className="font-semibold text-md md:text-xl text-color pb-3">
//                 CATEGORIES
//               </p>
//             </div>
//             <h3 className="font-semibold text-2xl md:text-4xl flex flex-col gap-6">
//               Most Popular Categories
//             </h3>
//           </div>
//           <div className="flex">
//             <Link
//               href="/categories"
//               className="px-4 py-3 md:px-6 md:py-4 text-md md:text-xl font-md bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 flex items-center justify-center gap-3"
//             >
//               View More
//               <Image
//                 src={righArrowIcon}
//                 alt="Popular Category"
//                 className="w-3 md:w-4"
//               />
//             </Link>
//           </div>

//           {/* Cards */}
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {category?.map((item) => (
//             <Link key={item._id} href="browseservice"><CateCard  item={item} /></Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PopularCategory;

"use client";
import { useGetAllCategoriesQuery } from "@/lib/features/category/categoryApi";
import CateCard from "@/sharred/CateCard";
import Image from "next/image";
import Link from "next/link";

// Assets
import popularcateIcon from "../../../public/popularcate.svg";
import righArrowIcon from "../../../public/whitearrow.svg";

const PopularCategory = () => {
  const { data, isLoading, isError } = useGetAllCategoriesQuery();
  const categories = data?.data?.result || [];

  return (
    <section className="max-w-[1240px] mx-auto px-6 py-20">
      <div className="flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <Image src={popularcateIcon} alt="" width={20} height={20} />
              </div>
              <span className="text-[#115E59] font-bold tracking-widest text-sm uppercase">
                Categories
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Explore Most Popular Categories
            </h2>
          </div>

          <Link
            href="/categories"
            className="group flex items-center gap-2 px-6 py-3 bg-[#115E59] text-white rounded-xl font-medium transition-all hover:bg-[#0d4a46] hover:shadow-lg active:scale-95"
          >
            View All
            <Image
              src={righArrowIcon}
              alt=""
              className="w-4 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-20 text-center text-gray-500 border-2 border-dashed rounded-2xl">
            Unable to load categories. Please refresh the page.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((item) => (
              <Link
                key={item._id}
                href={`/browseservice?category=${item._id}`}
                className="transition-transform duration-300 hover:-translate-y-2"
              >
                <CateCard item={item} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCategory;
