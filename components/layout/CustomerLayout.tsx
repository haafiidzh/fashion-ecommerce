"use client";

import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CustomerLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function CustomerLayout({ children, breadcrumbs }: CustomerLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-5 py-10 md:p-20">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="max-w-frame mx-auto px-4 xl:px-0">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
