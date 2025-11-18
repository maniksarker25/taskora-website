"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import ProviderProtectedRoute from "@/components/auth/ProviderProtectedRoute";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    // Remove html and body tags from route group layout
    <ProviderProtectedRoute>
      <Navbar />
      <div className="">{children}</div>
      <Footer />
    </ProviderProtectedRoute>
  );
}