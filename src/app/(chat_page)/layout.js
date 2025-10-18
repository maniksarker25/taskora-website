"use client";
import React, { useState } from "react";
import "../globals.css";
import ChatSideNav from "@/components/chat/ChatSideNav";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Menu } from "lucide-react";

const ChatLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mb-8">
          <Navbar />
        </div>
           <button
            className="md:hidden absolute top-24 left-6 z-50 p-2 rounded-lg bg-[#00786f] shadow "
            onClick={() => setOpen(!open)}
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        {/* Sidebar */}
        <div className="project_container flex justify-center items-center p-4">
          <div className="w-full flex gap-3 shadow-xl rounded-xl p-4">
            <div  className={`fixed top-0 left-0 h-full w-72 lg:w-96 bg-white  z-40 transform transition-transform duration-300 md:relative md:translate-x-0 
            ${open ? "translate-x-0" : "-translate-x-full"} md:block`}>
              <ChatSideNav />
            </div>

          {/* Overlay for mobile */}
          {open && (
            <div
              className="fixed inset-0 bg-black bg-opacity-10 z-30 md:hidden"
              onClick={() => setOpen(false)}
            />
          )}
            {/* Right Content */}
            <div className="flex-1 h-full bg-white border overflow-y-auto ">
              {children}
            </div>
          </div>
        </div>

        <div className="mt-16">
          {" "}
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default ChatLayout;
