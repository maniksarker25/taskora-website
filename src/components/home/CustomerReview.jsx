"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Styles
import "swiper/css";
import "swiper/css/pagination";

// Assets
import userImg2 from "../../../public/Ellipse 27.svg";
import userImg1 from "../../../public/Ellipse.svg";

const REVIEWS = [
  {
    id: 1,
    name: "Holland Canals",
    image: userImg1,
    rating: 5,
    comment:
      "I found a skilled plumber within hours. The bidding process was transparent, and the escrow payment gave me total peace of mind.",
  },
  {
    id: 2,
    name: "Tolman Panels",
    image: userImg2,
    rating: 5,
    comment:
      "Listing my services as a developer was seamless. I've already connected with three quality clients in my local area this week.",
  },
  {
    id: 3,
    name: "Kalian Sandals",
    image: userImg1,
    rating: 4,
    comment:
      "The real-time chat feature made it easy to negotiate the project details. Highly recommend for anyone looking for reliable experts.",
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    image: userImg2,
    rating: 5,
    comment:
      "The interface is very intuitive. I love how I can switch between being a customer and a provider on a single account.",
  },
];

const ReviewCard = ({ review }) => (
  <div className="h-full border border-gray-100 p-8 rounded-3xl shadow-sm bg-white flex flex-col items-center text-center group hover:border-[#115E59]/30 transition-all duration-300">
    <div className="relative mb-4">
      <Image
        src={review.image}
        alt={review.name}
        width={80}
        height={80}
        className="rounded-full border-4 border-teal-50"
      />
      <div className="absolute -bottom-2 -right-2 bg-[#115E59] text-white p-1.5 rounded-full">
        <FaStar size={10} />
      </div>
    </div>

    <h5 className="font-bold text-gray-900 text-lg">{review.name}</h5>

    <div className="flex text-yellow-400 gap-1 my-3">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
        />
      ))}
    </div>

    <p className="text-gray-600 leading-relaxed italic">"{review.comment}"</p>
  </div>
);

const CustomerReview = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-6 py-24 md:py-32">
      <div className="flex flex-col gap-4 justify-center items-center text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
          Trusted by <span className="text-[#115E59]">Thousands</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl font-medium">
          Hear from the service seekers and providers who are growing their businesses and solving
          tasks every day.
        </p>
      </div>

      <div className="relative pb-12">
        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          grabCursor={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Pagination, Autoplay]}
          className="review-swiper !pb-14"
        >
          {REVIEWS.map((review) => (
            <SwiperSlide key={review.id}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .review-swiper .swiper-pagination-bullet-active {
            background: #115e59 !important;
            width: 24px;
            border-radius: 4px;
          }
        `}</style>
      </div>
    </section>
  );
};

export default CustomerReview;
