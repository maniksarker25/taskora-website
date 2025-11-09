import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <Toaster 
          position="top-right"
          expand={true}
          richColors
          closeButton
        />
      {children}
      <Footer />
    </>
  );
}
