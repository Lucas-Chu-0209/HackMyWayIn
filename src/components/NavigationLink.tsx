"use client";

import Link, { useLinkStatus } from "next/link";
import { createPortal } from "react-dom";
import type { ComponentProps } from "react";
import NavigationStatus from "./NavigationStatus";

function PendingNavigation() {
  const { pending } = useLinkStatus();
  // Render outside transformed/hidden navigation containers, without changing link layout.
  return pending ? createPortal(<NavigationStatus />, document.body) : null;
}

export default function NavigationLink({ children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link {...props}>
      {children}
      <PendingNavigation />
    </Link>
  );
}
