// 'use client';
// import { useGetAllCategoriesQuery } from '@/lib/features/category/categoryApi';
// import CateCard from '@/sharred/CateCard';
// import Image from 'next/image';
// import Link from 'next/link';

// // Assets
// import popularcateIcon from '../../../public/popularcate.svg';
// import righArrowIcon from '../../../public/whitearrow.svg';

// const PopularCategory = () => {
//   const { data, isLoading, isError } = useGetAllCategoriesQuery();
//   const categories = data?.data?.result || [];

//   return (
//     <section className="max-w-[1240px] mx-auto px-6 py-20">
//       <div className="flex flex-col gap-12">
//         {/* Section Header */}
//         <div className="flex flex-col md:flex-row justify-between items-end gap-6">
//           <div className="space-y-2">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-teal-50 rounded-lg">
//                 <Image src={popularcateIcon} alt="" width={20} height={20} />
//               </div>
//               <span className="text-[#115E59] font-bold tracking-widest text-sm uppercase">
//                 Categories
//               </span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
//               Explore Most Popular Categories
//             </h2>
//           </div>

//           <Link
//             href="/categories"
//             className="group flex items-center gap-2 px-6 py-3 bg-[#115E59] text-white rounded-xl font-medium transition-all hover:bg-[#0d4a46] hover:shadow-lg active:scale-95"
//           >
//             View All
//             <Image
//               src={righArrowIcon}
//               alt=""
//               className="w-4 group-hover:translate-x-1 transition-transform"
//             />
//           </Link>
//         </div>

//         {/* Content Area */}
//         {isLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6].map((n) => (
//               <div key={n} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />
//             ))}
//           </div>
//         ) : isError ? (
//           <div className="py-20 text-center text-gray-500 border-2 border-dashed rounded-2xl">
//             Unable to load categories. Please refresh the page.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {categories.map((item) => (
//               <Link
//                 key={item._id}
//                 href={`/browseservice?category=${item._id}`}
//                 className="transition-transform duration-300 hover:-translate-y-2"
//               >
//                 <CateCard item={item} />
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default PopularCategory;

'use client';
import BackendStatusModal from '@/components/modal/BackendStatusModal';
import { useGetAllCategoriesQuery } from '@/lib/features/category/categoryApi';
import CateCard from '@/sharred/CateCard';
import Link from 'next/link';

// Assets

const PopularCategory = () => {
  const { data, isLoading, isError, isSuccess } = useGetAllCategoriesQuery();
  const categories = data?.data?.result || [];
  return (
    <>
      {/* 1. MODAL IS OUTSIDE THE LOADING CHECK SO IT CAN RENDER */}
      <BackendStatusModal isLoading={isLoading} />

      <section className="max-w-[1240px] mx-auto px-6 py-20">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            {/* ... (Your existing header code) ... */}
          </div>

          {/* 2. ONLY THIS PART DISAPPEARS DURING LOADING */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((item) => (
                <Link key={item._id} href={`/browseservice?category=${item._id}`}>
                  <CateCard item={item} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PopularCategory;
