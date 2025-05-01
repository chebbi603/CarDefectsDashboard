import { IconBell } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Alerts() {
  const navigate = useNavigate();
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:3001/get-alerts", {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setDisplayData(data))
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
        }
      });

    return () => controller.abort();
  }, []);
  return (
    <div className="flex flex-col gap-4 h-fit w-full ">
      <div className="w-full flex flex-row gap-2 items-center text-cyan-700 pt-2 pb-2">
        <IconBell />
        <p className="text-xl font-medium">Recent Alerts</p>
        <div className="flex-1 h-[1.5px] bg-slate-200"></div>
      </div>
      {displayData.map((item, index) => {
        return (
          <div className="relative w-full h-fit flex flex-col" key={index}>
            {Array.isArray(item) ? (
              item.map((subItem, subIndex) => (
                <div
                  key={subIndex}
                  className="bg-slate-100 p-4 rounded-md cursor-pointer hover:bg-cyan-200"
                  onClick={() => {
                    navigate(subItem.url);
                  }}
                >
                  <p className="font-medium text-lg">{subItem.title}</p>
                  <p className="text-sm">Date: {subItem.date}</p>
                  <p className="text-sm">
                    Resolution: {subItem.avgResolution} hours
                  </p>
                </div>
              ))
            ) : (
              <>
                <p className="font-medium text-lg">{item.date}</p>
                <p className="text-sm">
                  Resolution: {item.avgResolution} hours
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
