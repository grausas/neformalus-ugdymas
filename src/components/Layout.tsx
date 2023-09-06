import React, { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/login" && <Navbar />}
      {children}
    </>
  );
};
export default Layout;
