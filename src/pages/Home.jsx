import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-medium text-center">
        QLab Case Study Dashboard
      </h1>
      <div className="flex flex-col gap-4 bg-white p-8 border border-slate-200 shadow-md">
        <img
          src="https://www.bmw.com/content/dam/bmw/marketBMWCOM/bmw_com/categories/Design/sketch/sketch-08-media-hd.jpg"
          alt="BMW Design Sketch"
          className="w-full h-auto rounded-md"
        />
        <p className="text-lg text-slate-700 font-medium">
          QLab Case Study Dashboard provides comprehensive tools for analyzing
          and managing case studies. The platform offers real-time data
          visualization, anomaly detection, and collaborative case management
          features to help teams make data-driven decisions efficiently.
        </p>
        <p className="text-slate-500 text-md font-normal">
          Created by: Mohamed Ayoub Chebbi
        </p>
        <Link
          to="/dashboard"
          className="inline-block w-fit bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 transition-colors"
        >
          <p className="text-white font-medium">View Dashboard</p>
        </Link>
      </div>
    </div>
  );
}
