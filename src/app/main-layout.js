"use client";

import StoreProvider from "./StoreProvider";

export default function MainLayout({ children, hideNav = false }) {
  return (
    <>
      {/* {!hideNav && <Navbar />} */}
      <StoreProvider><main>{children}</main></StoreProvider>
      {/* {!hideNav && <Footer />} */}
    </>
  );
}