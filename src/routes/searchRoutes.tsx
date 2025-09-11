import { type RouteObject } from "react-router-dom";
import SearchLayout from "@/layouts/SearchLayout";
import StatsSearchPage from "@/pages/search/StatsSearchPage";
import ExamPage from "@/pages/ExamPage";
import ExamSearchPage from "@/pages/search/ExamSearchPage";

export const searchRoutes: RouteObject = {
  path: "search",
  element: <SearchLayout />,
  children: [
    { path: ":courseCode", element: <ExamSearchPage /> },
    { path: ":courseCode/stats", element: <StatsSearchPage /> },
    { path: ":courseCode/:examId", element: <ExamPage /> },
  ],
};
