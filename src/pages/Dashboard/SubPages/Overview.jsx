import React, { Suspense, useState, useEffect } from "react";
import ChartCard from "../../../components/ChartCard/ChartCard";
import {
  LineChart,
  ChartsReferenceLine,
  Gauge,
  BarChart,
  PieChart,
} from "@mui/x-charts";
import { IconBox, IconChartArcs } from "@tabler/icons-react";
import { DataGrid } from "@mui/x-data-grid";
import { Stack } from "@mui/material";

const Overview = ({ data, sendAxisData, sendItemData }) => {
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const sorted = [...data]
        .sort((a, b) => {
          // Convert DD.MM.YY to YYYY-MM-DD for proper date comparison
          const dateA = a.Date;
          const dateB = b.Date;
          const [dayA, monthA, yearA] = dateA.split(".");
          const [dayB, monthB, yearB] = dateB.split(".");
          const dateObjA = new Date(20 + yearA, monthA - 1, dayA);
          const dateObjB = new Date(20 + yearB, monthB - 1, dayB);
          if (dateObjA.getTime() !== dateObjB.getTime()) {
            return dateObjB - dateObjA;
          }
          // If dates are equal, compare times in HH:MM:SS format
          const timeA = String(a.Time || "00:00:00");
          const timeB = String(b.Time || "00:00:00");
          return timeB.localeCompare(timeA);
        })
        .slice(0, 6)
        .map((row, index) => ({ ...row, id: row.id || index }));

      setSortedData(sorted);
    } else {
      setSortedData([]);
    }
  }, [data]);

  const calculateMetrics = (data) => {
    const totalDefects = data.length;

    const avgSeverity =
      data.reduce((sum, defect) => sum + (defect["Severity Rating"] || 0), 0) /
      (data.length || 1);

    const avgResolutionTime =
      data.reduce(
        (sum, defect) => sum + (defect["Resolution Time (in hours)"] || 0),
        0
      ) / (data.length || 1);

    const rootCauseIdentifiedCount = data.filter(
      (defect) => defect["Root Cause Identified"] === "Yes"
    ).length;

    const rootCauseIdentificationRate =
      (rootCauseIdentifiedCount / (data.length || 1)) * 100;

    return {
      totalDefects,
      avgSeverity,
      avgResolutionTime,
      rootCauseIdentificationRate,
    };
  };

  const calculateDefectsOverTime = (data) => {
    // Group defects by day
    const defectsByDay = data.reduce((acc, defect) => {
      const date = new Date(defect["Date"]);
      const day = `${String(date.getDate()).padStart(2, "0")}.${String(
        date.getMonth() + 1
      ).padStart(2, "0")}.${String(date.getFullYear()).slice(-2)}`; // Format as dd.mm.yy

      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day]++;
      return acc;
    }, {});

    // Get the last 10 days
    const allDays = Object.keys(defectsByDay).sort(
      (a, b) =>
        new Date(a.split(".").reverse().join("-")) -
        new Date(b.split(".").reverse().join("-"))
    );
    const recentDays = allDays.slice(-15);

    // Calculate mean
    const totalDefects = recentDays.reduce(
      (sum, day) => sum + defectsByDay[day],
      0
    );
    const mean = totalDefects / recentDays.length;

    // Calculate standard deviation
    const variance =
      recentDays.reduce((sum, day) => {
        const deviation = defectsByDay[day] - mean;
        return sum + deviation * deviation;
      }, 0) / recentDays.length;
    const stdDev = Math.sqrt(variance);

    // Calculate two standard deviations
    const lowerBound = mean - 2 * stdDev; // -5.87 hours
    const upperBound = mean + 2 * stdDev; // 16.85 hours

    // Practical adjustment: Prevent negative lower bounds for positive metrics
    const finalLowerBound = Math.max(lowerBound, 0);
    return {
      xAxis: recentDays,
      data: [{ data: recentDays.map((day) => defectsByDay[day]) }],
      lowerBound: finalLowerBound,
      upperBound,
    };
  };

  const formatNumber = (num, decimals = 2) =>
    num ? num.toFixed(decimals) : "0";

  const metrics = calculateMetrics(data);
  const defectsOverTime = calculateDefectsOverTime(data);

  return (
    <div className="flex flex-col gap-4" style={{ fontFamily: "Figtree" }}>
      <div className="w-full flex flex-row gap-2 items-center text-cyan-700 pt-2 pb-2">
        <IconChartArcs />
        <p className="text-xl font-medium">General Metrics</p>
        <div className="flex-1 h-[1.5px] bg-slate-200"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ChartCard showIcon={false} title="Total Defects">
          <p className="text-black text-4xl">{metrics.totalDefects}</p>
        </ChartCard>
        <ChartCard showIcon={false} title="Average Severity">
          <div className="flex flex-flex-row items-center gap-2">
            <p
              className={`text-4xl 
              ${
                metrics.avgSeverity >= 7
                  ? `text-red-600`
                  : `${
                      metrics.avgSeverity < 3
                        ? `text-green-600`
                        : `text-yellow-600`
                    }`
              }`}
            >
              {formatNumber(metrics.avgSeverity)}
            </p>
            <div
              className={`px-2 py-1 rounded-md text-md font-medium ${
                metrics.avgSeverity >= 7
                  ? "bg-red-100 text-red-600"
                  : metrics.avgSeverity < 3
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              <p>
                {metrics.avgSeverity >= 7
                  ? "Critical"
                  : metrics.avgSeverity < 3
                  ? "Good"
                  : "Concerning"}
              </p>
            </div>
          </div>
        </ChartCard>
        <ChartCard showIcon={false} title="Avg Resolution Time" classtitle>
          <p className="text-black text-4xl">
            {formatNumber(metrics.avgResolutionTime)}h
          </p>
        </ChartCard>
        <ChartCard showIcon={false} title="% Root Cause Found">
          <p className="text-black text-4xl">
            {formatNumber(metrics.rootCauseIdentificationRate)}%
          </p>
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Recent Defects"
          description="Find recently detected defects"
        >
          <div className="w-full">
            <DataGrid
              rows={sortedData}
              columns={[
                { field: "id", headerName: "ID", width: 50 },
                { field: "Defect Name", headerName: "Defect", width: 150 },
                {
                  field: "Date",
                  headerName: "Date",
                  width: 80,
                },
                {
                  field: "Time",
                  headerName: "Time",
                  width: 80,
                },

                {
                  field: "Severity Rating",
                  headerName: "Severity",
                  width: 100,
                },
                { field: "Station", headerName: "Station", width: 150 },
                {
                  field: "Part of the Car",
                  headerName: "Part of the Car",
                  width: 150,
                },
                { field: "Car Model", headerName: "Car Model", width: 120 },
                {
                  field: "Resolution Time (in hours)",
                  headerName: "Resolution Time (in hours)",
                  width: 200,
                },
                {
                  field: "Root Cause Identified",
                  headerName: "Root Cause Identified",
                  width: 150,
                },
                {
                  field: "Defect Category",
                  headerName: "Defect Category",
                  width: 150,
                },
              ]}
              hideFooter
              disableRowSelectionOnClick
            />
          </div>
        </ChartCard>
        <Suspense fallback={<div>Loading chart...</div>}>
          <ChartCard
            title="Defects Overtime"
            description="Monitor the number of defects in the past 15 days"
          >
            <LineChart
              className="chart"
              series={defectsOverTime.data}
              height={300}
              xAxis={[
                {
                  data: defectsOverTime.xAxis,
                  scaleType: "band",
                  height: 30,
                },
              ]}
              margin={{
                left: 0,
                right: 30,
                top: 30,
                bottom: 0,
              }}
              yAxis={[
                {
                  width: 30,
                  position: "left",
                },
              ]}
              sx={{
                width: "100% !important",
                alignSelf: "flex-start",
                justifySelf: "flex-start",
              }}
              onAxisClick={(event, d) => {
                const formattedOutput = {
                  Date: d.axisValue,
                  Anomalies: d.seriesValues["auto-generated-id-0"],
                };
                sendAxisData(formattedOutput);
              }}
            >
              <ChartsReferenceLine
                y={defectsOverTime.upperBound}
                label="Anomaly threshold"
                labelStyle={{
                  fill: "red",
                  fontFamily: "Figtree",
                  fontSize: "12px",
                }}
                lineStyle={{ stroke: "red", strokeDasharray: "5,5" }} // Updated to dashed line
              />
            </LineChart>
          </ChartCard>
        </Suspense>
      </div>
      <div className="w-full flex flex-row gap-2 items-center text-cyan-700 pt-2 pb-2">
        <IconBox />
        <p className="text-xl font-medium">Defects by category</p>
        <div className="flex-1 h-[1.5px] bg-slate-200"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        <ChartCard
          showIcon={false}
          title="Total Defects by Model"
          description="Distribution of defects across different car models"
        >
          <div className="w-full">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ["Base", "Alpina", "IX0M", "Long"],
                },
              ]}
              yAxis={[
                {
                  colorMap: {
                    type: "continuous",
                    min: 500,
                    max: 3000,
                    color: ["green", "orange"],
                  },
                },
              ]}
              series={[
                {
                  data: [
                    data.filter((d) => d["Car Model"] === "Base").length,
                    data.filter((d) => d["Car Model"] === "Alpina").length,
                    data.filter((d) => d["Car Model"] === "IX0M").length,
                    data.filter((d) => d["Car Model"] === "Long").length,
                  ].map((val) => Number(formatNumber(val))),
                },
              ]}
              height={360}
              margin={{ top: 20, bottom: 1, left: 1, right: 1 }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </div>
        </ChartCard>
        <ChartCard
          showIcon={false}
          title="Total Defects by Car Part"
          description="Distribution of defects across different car parts"
        >
          <div className="w-full">
            <BarChart
              dataset={[...new Set(data.map((d) => d["Part of the Car"]))].map(
                (part) => ({
                  part: part,
                  count: data.filter((d) => d["Part of the Car"] === part)
                    .length,
                })
              )}
              yAxis={[
                {
                  scaleType: "band",
                  width: 120,
                  dataKey: "part",
                },
              ]}
              xAxis={[
                {
                  min: 0,
                  max: 2000,
                  colorMap: {
                    type: "continuous",
                    min: 0,
                    max: 2000,
                    color: ["green", "orange"],
                  },
                },
              ]}
              series={[
                {
                  dataKey: "count",
                  label: "Number of Defects",
                  valueFormatter: (value) => Number(formatNumber(value)),
                },
              ]}
              layout="horizontal"
              height={360}
              margin={{ top: 20, bottom: 1, left: 1, right: 1 }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </div>
        </ChartCard>
        <ChartCard
          showIcon={false}
          title="Total Defects by Station"
          description="Distribution of defects across different stations"
        >
          <div className="w-full">
            <PieChart
              series={[
                {
                  colorMap: {
                    type: "continuous",
                    min: 0,
                    max: 2000,
                    color: ["green", "orange"],
                  },
                  innerRadius: 60,
                  data: Object.entries(
                    data.reduce((acc, d) => {
                      // Normalize station names by trimming and converting to title case
                      const station = d.Station.trim()
                        .toLowerCase()
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");
                      acc[station] = (acc[station] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([station, count]) => ({
                    id: station,
                    value: count,
                    label: station,
                  })),
                },
              ]}
              height={360}
              margin={{ top: 20, bottom: 30, left: 20, right: 20 }}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "bottom", horizontal: "middle" },
                  itemMarkWidth: 10,
                  style: {
                    justifyContent: "center",
                    padding: "0px 24px",
                    fontSize: "12px",
                    fontFamily: "Figtree",
                  },
                },
              }}
            />
          </div>
        </ChartCard>
        <ChartCard
          showIcon={false}
          title="Total Defects by Severity"
          description="Distribution of defects across different severity levels"
        >
          <div className="w-full flex items-center justify-center h-full">
            <BarChart
              dataset={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((severity) => ({
                severityLevel: severity,
                count: data.filter((d) => d["Severity Rating"] === severity)
                  .length,
              }))}
              yAxis={[
                {
                  scaleType: "band",
                  dataKey: "severityLevel",
                  colorMap: {
                    type: "piecewise",
                    thresholds: [3, 8], // Change the thresholds as needed,
                    colors: ["green", "orange", "red"],
                  },
                },
              ]}
              series={[
                {
                  dataKey: "count",
                  label: "Number of Defects",
                  valueFormatter: (value) => Number(formatNumber(value)),
                },
              ]}
              layout="horizontal"
              height={400}
              margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Overview;
