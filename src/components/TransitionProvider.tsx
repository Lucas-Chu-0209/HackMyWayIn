"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/content";

type TransitionKind = "none" | "slide-from-right" | "slide-from-left" | "reveal" | "fade";

const NAV_ROUTE_ORDER = navLinks.map((item) => item.href);

function getNavIndex(pathname: string) {
  if (pathname === "/") {
    return 0;
  }

  const index = NAV_ROUTE_ORDER.findIndex((route) => route !== "/" && pathname.startsWith(route));
  return index === -1 ? null : index;
}

function isPostDetailRoute(pathname: string) {
  return pathname.startsWith("/posts/");
}

function getTransitionKind(previousPathname: string, nextPathname: string): TransitionKind {
  if (isPostDetailRoute(nextPathname) && !isPostDetailRoute(previousPathname)) {
    return "reveal";
  }

  const previousIndex = getNavIndex(previousPathname);
  const nextIndex = getNavIndex(nextPathname);

  if (previousIndex !== null && nextIndex !== null && previousIndex !== nextIndex) {
    return nextIndex > previousIndex ? "slide-from-right" : "slide-from-left";
  }

  return "fade";
}

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [transitionKind, setTransitionKind] = useState<TransitionKind>("none");

  useEffect(() => {
    // Skip initial mount and no-op path updates; animate only real route changes.
    if (previousPathname.current === pathname) {
      return;
    }

    setTransitionKind(getTransitionKind(previousPathname.current, pathname));
    previousPathname.current = pathname;
  }, [pathname]);

  return <div className={`route-transition route-transition--${transitionKind}`}>{children}</div>;
}
