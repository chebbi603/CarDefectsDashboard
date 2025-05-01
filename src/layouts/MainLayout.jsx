import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./Layouts.css";
import Sidebar from "./Sidebar";
import LeftPanel from "./LeftPanel";

export default function MainLayout({
  openSidebar,
  axisData,
  itemData,
  closeLeftBar,
  rowData,
}) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(openSidebar);

  useEffect(() => {
    setIsSideBarOpen(openSidebar);
  }, [openSidebar]);

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-wrapper">
        <div className="main-container">
          <Outlet />
        </div>
        {isSideBarOpen && (
          <LeftPanel
            itemData={itemData}
            axisData={axisData}
            rowData={rowData}
            closeLeftBar={closeLeftBar}
          />
        )}
      </div>
    </div>
  );
}
