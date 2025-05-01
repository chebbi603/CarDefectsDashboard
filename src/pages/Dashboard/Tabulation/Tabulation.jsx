import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Tabulation.css";
import {
  IconBellCheck,
  IconBellPin,
  IconChartArea,
  IconClock,
  IconMenu4,
  IconTopologyBus,
} from "@tabler/icons-react";

const Tabulation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: "overview",
      label: "Overview",
      icon: <IconMenu4 />,
    },
    {
      key: "analysis",
      label: "Analysis",
      icon: <IconChartArea />,
    },
    {
      key: "alerts",
      label: "Alerts",
      icon: <IconBellPin />,
    },
  ];

  const handleTabChange = (key) => {
    navigate(`/dashboard/${key}`);
  };

  // Get active tab from current path
  const getActiveTab = () => {
    const path = location.pathname.split("/");
    return path[path.length - 1] || "overview";
  };

  const activeTab = getActiveTab();

  return (
    <div className="tabs-container">
      <ul className="tabs-list">
        {items.map((item) => (
          <li
            key={item.key}
            className={`tab-item ${activeTab === item.key ? "active" : ""}`}
            onClick={() => handleTabChange(item.key)}
          >
            {item.icon}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabulation;
