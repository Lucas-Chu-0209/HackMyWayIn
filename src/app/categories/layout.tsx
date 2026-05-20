import type { ReactNode } from "react";

import BlogSidebarPageLayout from "@/components/BlogSidebarPageLayout";

export default function CategoriesLayout({ children }: { children: ReactNode }) {
  return <BlogSidebarPageLayout>{children}</BlogSidebarPageLayout>;
}
