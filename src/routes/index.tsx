import { type RouteObject } from "react-router-dom";
import { infoRoutes } from "./infoRoutes";
import { mainRoutes } from "./mainRoutes";
import { searchRoutes } from "./searchRoutes";

const routes: RouteObject[] = [
  {
    ...mainRoutes,
    index: false,
    children: [...(mainRoutes.children ?? []), searchRoutes, infoRoutes],
  },
];

export default routes;
