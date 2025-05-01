import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layouts.css";
import "./sidebar.css";
import logo from "../assets/logo.svg";
import IconButton from "../components/IconButton";
import {
  IconDashboard,
  IconEyeSearch,
  IconFolderSearch,
  IconLayoutSidebarLeftCollapse,
  IconTable,
} from "@tabler/icons-react";
import { IconHome } from "@tabler/icons-react";

const Sidebar = () => {
  const location = useLocation();

  // Sample static categories - you can replace this with your actual categories
  const routes = [
    { id: 0, name: "Home", path: "/home", icon: <IconHome /> },
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: <IconDashboard />,
    },
    { id: 2, name: "List", path: "/list", icon: <IconTable /> },
    { id: 3, name: "Cases", path: "/cases", icon: <IconFolderSearch /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img className="sidebar-logo" src={logo} />
      </div>
      <nav className="sidebar-nav">
        <ul className="flex flex-col gap-2">
          {routes.map((route) => (
            <Link to={route.path}>
              <li
                key={route.id}
                className={`sidebar-nav-item ${
                  location.pathname.startsWith(route.path) ? "active" : ""
                }`}
              >
                {" "}
                {route.icon}
                {route.name}
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
