import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Providers from "@/components/Providers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import routes from "@/routes";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>
);
