import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdDateRange, MdMessage } from "react-icons/md";
import { BsChatLeftText } from "react-icons/bs";
import Link from "next/link";
import srvcporvider from "../../../public/profile_image.jpg";
import Image from "next/image";

const bids = [
  {
    id: 1,
    name: "Ronald Richards",
    price: "₦24.00",
    rating: "4.5",
    reviews: "520 Reviews",
    date: "24 January, 2023",
    message:
      "I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase! I have a pre-paid data plan so I was worried that this phone wouldn't connect with my data plan, since the new phones don't have the physical sim tray anymore.",
  },
  {
    id: 2,
    name: "Ronald Richards",
    price: "₦24.00",
    rating: "4.5",
    reviews: "520 Reviews",
    date: "24 January, 2023",
    message:
      "I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase! I have a pre-paid data plan so I was worried that this phone wouldn't connect with my data plan, since the new phones don't have the physical sim tray anymore.",
  },
];

const questions = [
  {
    id: 1,
    name: "Ronald Richards",
    date: "24 January, 2023",
    message:
      "I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!",
  },
  {
    id: 2,
    name: "Ronald Richards",
    date: "24 January, 2023",
    message:
      "Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?",
  },
];

const ServiceBids = () => {
  const [activeTab, setActiveTab] = useState("bids");
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8 border rounded-2xl p-6 bg-white shadow mt-8 items-center">
        {/* Left side */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
           
            <div className="w-12 h-12 flex items-center overflow-hidden rounded-full"> <Image src={srvcporvider} className="w-full h-full object-cover" alt="serpice provider"/></div>
            
            <div>
              <p className="text-md font-semibold text-black">Posted by</p>
              <p className="text-sm text-gray-600">15 May 2020 8:00 am</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[#E6F4F1] text-[#115E59] flex items-center justify-center">
              <FaMapMarkerAlt size={20} />
            </div>
            <div>
              <p className="text-md font-semibold text-black">Location</p>
              <p className="text-sm text-gray-600">New York, USA</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[#E6F4F1] text-[#115E59] flex items-center justify-center">
              <MdDateRange size={20} />
            </div>
            <div>
              <p className="text-md font-semibold text-black">To Be Done On</p>
              <p className="text-sm text-gray-600">15 May 2020 8:00 am</p>
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-black">Details</h3>
            <p className="text-gray-600 text-sm leading-6">
              I'm after 2 jackets that are sold online but available from 2
              specific stores. They need to be sent out to you in the US and
              then forwarded to me in Sydney in 1 package for convenience. For
              more information please direct message me! Thanks!
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-auto">
          <div className="bg-[#E6F4F1] rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="mb-4">
              <p className="text-gray-500">Task budget</p>
              <p className="text-2xl font-bold text-black">₦24.00</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button className="px-6 py-2 border-2 border-[#115e59] rounded-md hover:bg-[#115e59] hover:text-white transition transform duration-300 cursor-pointer text-[#115e59] ]">
                Submit A Bid Again
              </button>
              <Link
                href="/chat"
                className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer flex items-center gap-3 justify-center"
              >
              <MdMessage/> Chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-3 ">
        <button
          onClick={() => setActiveTab("bids")}
          className={`pb-2 ${
            activeTab === "bids"
              ? "border-b-2 bg-[#115E59] px-6 rounded-md py-2 text-white cursor-pointer"
              : "text-black bg-[#E6F4F1] px-6 rounded-md py-2 cursor-pointer"
          }`}
        >
          Bids
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`pb-2 ${
            activeTab === "questions"
              ? "border-b-2 bg-[#115E59] px-6 rounded-md py-2 text-white cursor-pointer"
              : "text-black bg-[#E6F4F1] px-6 rounded-md py-2 cursor-pointer"
          }`}
        >
          Questions
        </button>
      </div>

      {/* Bids / Questions */}
      <div className="mt-4 space-y-4">
        {activeTab === "bids" &&
          bids.map((bid) => (
            <div
              key={bid.id}
              className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg"
            >
              <div className="w-16 h-16 rounded-full overflow-clip">
                {" "}
                <Image
                  src={srvcporvider}
                  alt={bid.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{bid.name}</h4>
                  <p className="text-sm text-gray-500">{bid.date}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mt-2">{bid.message}</p>
                  {/* <button
                        href="/construction"
                        className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer flex gap-2 items-center justify-center mt-12"
                      >
                        <BsChatLeftText />
                        Chat Now
                      </button> */}
                </div>
              </div>
            </div>
          ))}

        {activeTab === "questions" &&
          questions.map((q) => (
            <div
              key={q.id}
              className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg"
            >
              <div className="w-16 h-16 rounded-full overflow-clip">
                {" "}
                <Image
                  src={srvcporvider}
                  alt={q.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{q.name}</h4>
                  <p className="text-sm text-gray-500">{q.date}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mt-2">{q.message}</p>
                  <button
                    href="/construction"
                    className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer flex gap-2 items-center justify-center mt-12"
                  >
                    <BsChatLeftText />
                    Chat Now
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ServiceBids;
