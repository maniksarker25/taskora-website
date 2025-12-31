"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { FaStar } from "react-icons/fa";
// import required modules
import { Pagination } from "swiper/modules";
import Image from "next/image";
import Ellipse from "../../../public/Ellipse.svg";
import Ellipse27 from "../../../public/Ellipse 27.svg";

const CustomerReview = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-4 pt-36 pb-36">
      <div className="flex flex-col gap-6 justify-center items-center text-center py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold ">
          Our Tasker Reviews
        </h1>
        <p className="text-gray-600 text-base font-medium">
          Here are a few sample traveler reviews that you can feature on our
          website
        </p>
      </div>

      {/* swiper slider  */}
      <>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          grabCursor={true}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="border border-[#E5E7EB] p-6 rounded-lg shadow-lg bg-[#E6F4F1] flex flex-col gap-2 justify-center items-center text-center">
              <Image src={Ellipse} alt="Ellipse" />
              <h5 className="font-semibold text-xl">Holiand Canals</h5>
              <div className="flex text-yellow-400 gap-1">
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
              </div>
              <p className="mt-4">
                "I found my rental condo within two days of browsing
                EasyRent.sg. The inquiry process was so simple, and I got a
                response from the agent almost instantly!"
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="border border-[#E5E7EB] p-6 rounded-lg shadow-lg bg-[#E6F4F1] flex flex-col gap-2 justify-center items-center text-center">
              <Image src={Ellipse27} alt="Ellipse" />
              <h5 className="font-semibold text-xl">Tolman Panels</h5>
              <div className="flex text-yellow-400 gap-1">
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
              </div>
              <p className="mt-4">
                "Listing my unit was incredibly easy. I received quality tenant
                inquiries without any hassle. Highly recommended for any
                landlord looking to rent fast."
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="border border-[#E5E7EB] p-6 rounded-lg shadow-lg bg-[#E6F4F1] flex flex-col gap-2 justify-center items-center text-center">
              <Image src={Ellipse} alt="Ellipse" />
              <h5 className="font-semibold text-xl">kalian Sandals</h5>
              <div className="flex text-yellow-400 gap-1">
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
              </div>
              <p className="mt-4">
                "EasyRent.sg has helped me connect with serious tenants. The
                platform is well-organized, and I love receiving email inquiries
                from potential renters directly."
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="border border-[#E5E7EB] p-6 rounded-lg shadow-lg bg-[#E6F4F1] flex flex-col gap-2 justify-center items-center text-center">
              <Image src={Ellipse} alt="Ellipse" />
              <h5 className="font-semibold text-xl">Holiand Canals</h5>
              <div className="flex text-yellow-400 gap-1">
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
              </div>
              <p className="mt-4">
                "I found my rental condo within two days of browsing
                EasyRent.sg. The inquiry process was so simple, and I got a
                response from the agent almost instantly!"
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="border border-[#E5E7EB] p-6 rounded-lg shadow-lg bg-[#E6F4F1] flex flex-col gap-2 justify-center items-center text-center">
              <Image src={Ellipse} alt="Ellipse" />
              <h5 className="font-semibold text-xl">Holiand Canals</h5>
              <div className="flex text-yellow-400 gap-1">
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
                <FaStar className="w-3" />
              </div>
              <p className="mt-4">
                "I found my rental condo within two days of browsing
                EasyRent.sg. The inquiry process was so simple, and I got a
                response from the agent almost instantly!"
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </>
    </section>
  );
};

export default CustomerReview;
