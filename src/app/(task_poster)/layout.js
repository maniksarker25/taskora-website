import React from "react";
import "../globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Toaster } from "sonner";

const AuthLayout = ({ children }) => {
  return (
    <html >
      <body>
        <Navbar/>
        <div>{children}</div>
        <Toaster 
          position="top-right"
          expand={true}
          richColors
        />
        <Footer/>
      </body>
    </html>
  );
};

export default AuthLayout;