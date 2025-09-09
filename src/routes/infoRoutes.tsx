import FAQPage from "@/pages/info/FaqPage";
import FeedbackPage from "@/pages/info/FeedbackPage";
import InfoLayout from "@/layouts/InfoLayout";
import OmOss from "@/pages/info/AboutUs";
import PrivacyPolicyPage from "@/pages/info/PrivacyPolicyPage";
import { type RouteObject } from "react-router-dom";
import UploadExamPage from "@/pages/info/UploadExamPage";

export const infoRoutes: RouteObject = {
  element: <InfoLayout />,
  children: [
    { path: "feedback", element: <FeedbackPage /> },
    { path: "privacy-policy", element: <PrivacyPolicyPage /> },
    { path: "upload-exams", element: <UploadExamPage /> },
    { path: "faq", element: <FAQPage /> },
    { path: "om-oss", element: <OmOss /> },
  ],
};
