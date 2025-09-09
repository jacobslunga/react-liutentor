import { Outlet, useLocation } from "react-router-dom";

import Footer from "@/components/Footer";
import React from "react";

// import CookieBanner from "@/components/banners/CookieBanner";
// import { ExamModeManager } from "@/lib/examMode";
// import Footer from "@/components/Footer";
// import SystemUpdateBanner from "@/components/banners/SystemUpdatebanner";

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  const customPagePaths = [
    "/faq",
    "/om-oss",
    "/feedback",
    "/privacy-policy",
    "/upload-exams",
  ];

  const isExamPage = /^\/search\/[A-Z0-9]+\/[0-9]+$/.test(pathname);
  const isCustomPage = customPagePaths.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="grow">
        <Outlet />
      </main>

      {!isExamPage && !isCustomPage && (
        <div className="mt-auto">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
