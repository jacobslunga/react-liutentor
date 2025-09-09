import InfoPageFooter from "@/components/info/InfoPageFooter";
import { Outlet } from "react-router-dom";
import React from "react";
import Sidebar from "@/components/info/Sidebar";

const InfoLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 lg:pl-56">
        <Outlet />
        <InfoPageFooter />
      </div>
    </div>
  );
};

export default InfoLayout;
