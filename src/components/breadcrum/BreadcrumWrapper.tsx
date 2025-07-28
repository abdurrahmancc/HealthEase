// components/BreadcrumWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Breadcrum from "./Breadcrum";

const BreadcrumWrapper = () => {
  const pathname = usePathname();

  const hideBreadcrumRoutes = ["/login", "/register"];

  const shouldHideBreadcrum = hideBreadcrumRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (shouldHideBreadcrum) return null;

  return <Breadcrum />;
};

export default BreadcrumWrapper;
