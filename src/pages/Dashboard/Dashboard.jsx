import "./dashboard.css";
import { IconDashboard } from "@tabler/icons-react";
import "tailwindcss";
import Tabulation from "./Tabulation/Tabulation";
import { Outlet } from "react-router";

const Dashboard = ({ data }) => {
  return (
    <div className="container flex flex-col gap-6">
      <div className="dashboard-header flex flex-col gap-2 align-center pt-1">
        <div className="flex flex-row gap-2 align-center header-headline">
          <IconDashboard size={32} />
          <p className="text-2xl font-medium">Dashboard</p>
        </div>
        <p className="text-sm font-normal">View and find valuable insights</p>
      </div>
      <Tabulation />
      <Outlet />
    </div>
  );
};

export default Dashboard;
