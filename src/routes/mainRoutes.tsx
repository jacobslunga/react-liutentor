// import ExamModePage from "@/pages/ExamModePage";
import HomePage from "@/pages/HomePage";
import MainLayout from "@/layouts/MainLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import { type RouteObject } from "react-router-dom";

export const mainRoutes: RouteObject = {
  path: "/",
  element: <MainLayout />,
  children: [
    { index: true, element: <HomePage /> },
    // { path: "exam-mode/:examId", element: <ExamModePage /> },
    { path: "*", element: <NotFoundPage /> },
  ],
};
