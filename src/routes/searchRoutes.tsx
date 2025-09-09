import { type RouteObject } from "react-router-dom";
import SearchLayout from "@/layouts/SearchLayout";
import StatsSearchPage from "@/pages/search/StatsSearchPage";
import TentaPage from "@/pages/TentaPage";
import TentaSearchPage from "@/pages/search/TentaSearchPage";

export const searchRoutes: RouteObject = {
  path: "search",
  element: <SearchLayout />,
  children: [
    { path: ":courseCode", element: <TentaSearchPage /> },
    { path: ":courseCode/stats", element: <StatsSearchPage /> },
    { path: ":courseCode/:examId", element: <TentaPage /> },
  ],
};
