import { Icon123, IconAlertCircle, IconAnalyze } from "@tabler/icons-react";
import React, { useEffect } from "react";
import ChartCard from "../../../components/ChartCard/ChartCard";
import { BarChart, ChartsReferenceLine, LineChart } from "@mui/x-charts";
import HeatMap from "react-heatmap-grid";

const Analysis = ({ data, sendAxisData, sendItemData }) => {
  //chart 2
  const shifts = ["Morning", "Afternoon", "Night"];
  const shiftData = shifts.map((shift) => {
    const shiftRows = data.filter((row) => row["Production Shift"] === shift);
    const total = shiftRows.length;
    const critical = shiftRows.filter(
      (row) => row["Defect Category"] === "Critical"
    ).length;
    return { shift, proportion: total ? critical / total : 0 };
  });

  //chart 2
  const shiftProportions = shiftData.map((d) => d.proportion);
  const meanProportion =
    shiftProportions.reduce((a, b) => a + b, 0) / shiftProportions.length;
  const avgSampleSize = data.length / shifts.length; // average sample size per shift
  const shiftUCL =
    meanProportion +
    3 * Math.sqrt((meanProportion * (1 - meanProportion)) / avgSampleSize);
  const shiftLCL =
    meanProportion -
    3 * Math.sqrt((meanProportion * (1 - meanProportion)) / avgSampleSize);

  //chart 1
  const calculateDailyAverages = (data) => {
    const groupedByDay = {};

    // Group resolution times by date
    data.forEach((row) => {
      const date = row["Date"];
      if (!groupedByDay[date]) groupedByDay[date] = [];
      groupedByDay[date].push(row["Resolution Time (in hours)"]);
    });

    // Calculate average resolution time for each date
    const chartData = Object.entries(groupedByDay).map(([date, times]) => ({
      date,
      avgResolution: times.reduce((a, b) => a + b, 0) / times.length,
    }));

    return chartData;
  };

  const chartData = calculateDailyAverages(data);
  // Filter data to include only the last 15 days
  const last15Days = chartData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 15)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const values = last15Days.map((d) => d.avgResolution);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
  );
  const UCL = mean + 2 * stdDev;
  const LCL = mean - 2 * stdDev;

  const keyToLabel = {
    avgResolution: "Avg Resolution Time",
    UCL: "Upper Control Limit",
    LCL: "Lower Control Limit",
    mean: "Mean",
  };

  const colors = {
    avgResolution: undefined,
    UCL: "red",
    LCL: "red",
    mean: "green",
  };

  const outOfControlDates = last15Days.filter(
    (day) => day.avgResolution > UCL || day.avgResolution < LCL
  );

  if (outOfControlDates.length > 0) {
    console.log("Out of control points detected on dates:");
    outOfControlDates.forEach((day) => {
      console.log(`${day.date} (${day.avgResolution.toFixed(2)} hours)`);
    });
  }

  const outOfControlMessage =
    outOfControlDates.length > 0 ? (
      <div className="flex flex-row gap-2 p-2 text-yellow-600 bg-yellow-100 font-medium rounded-lg w-full">
        <IconAlertCircle />
        <p>
          Out of control points detected on dates:
          <br />
          {outOfControlDates
            .map((day) => `${day.date} (${day.avgResolution.toFixed(2)} hours)`)
            .join("\n")}
        </p>
      </div>
    ) : null;

  const sendDataToServer = async (data) => {
    try {
      const response = await fetch("http://localhost:3001/send-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Data successfully sent to server:", responseData);
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  useEffect(() => {
    if (outOfControlDates.length > 0) {
      sendDataToServer(
        outOfControlDates.map((day) => ({
          id: 2,
          title: "Average Resolution time: Out of Control Points Detected",
          date: day.date,
          url: "/dashboard/analysis",
        }))
      );
    }
  }, [outOfControlDates]);

  // chart 3
  const calculateDefectFrequencies = (data) => {
    const defectCounts = {};

    // Count occurrences of each defect name
    data.forEach((row) => {
      const defectName = row["Defect Name"];
      if (defectCounts[defectName]) {
        defectCounts[defectName]++;
      } else {
        defectCounts[defectName] = 1;
      }
    });

    // Convert to array and sort by frequency
    const sortedDefects = Object.entries(defectCounts).sort(
      (a, b) => b[1] - a[1]
    );

    // Calculate cumulative percentage
    const totalDefects = data.length;
    let cumulativeCount = 0;
    const paretoData = sortedDefects.map(([defect, count]) => {
      cumulativeCount += count;
      return {
        defect,
        count,
        cumulativePercentage: (cumulativeCount / totalDefects) * 100,
      };
    });

    return paretoData;
  };

  const paretoData = calculateDefectFrequencies(data);

  return (
    <div className="flex flex-col gap-4" style={{ fontFamily: "Figtree" }}>
      <div className="w-full flex flex-row gap-2 items-center text-cyan-700 pt-2 pb-2">
        <IconAnalyze />
        <p className="text-xl font-medium">Analysis Breakdown</p>
        <div className="flex-1 h-[1.5px] bg-slate-200"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        <ChartCard
          showIcon={false}
          title="Average Resolution Time"
          description="Monitor the average resolution time in the last 15 days"
        >
          <div className="w-full">
            <LineChart
              xAxis={[
                {
                  data: last15Days.map((d) => d.date),
                  scaleType: "band",
                  label: "Date",
                },
              ]}
              yAxis={[
                {
                  width: 50,
                  label: "Resolution Time (in hours)",
                  min: Math.min(LCL, Math.min(...values)) - stdDev,
                  max: Math.max(UCL, Math.max(...values)) + stdDev,
                },
              ]}
              series={[
                {
                  data: values,
                  label: keyToLabel.avgResolution,
                  showMark: true,
                },
                {
                  data: Array(last15Days.length).fill(UCL),
                  label: keyToLabel.UCL,
                  color: colors.UCL,
                  showMark: false,
                },
                {
                  data: Array(last15Days.length).fill(LCL),
                  label: keyToLabel.LCL,
                  color: colors.LCL,
                  showMark: false,
                },
                {
                  data: Array(last15Days.length).fill(mean),
                  label: keyToLabel.mean,
                  color: colors.mean,
                  showMark: false,
                },
              ]}
              height={300}
            />
          </div>
          {outOfControlMessage}
        </ChartCard>
        <ChartCard
          showIcon={false}
          title="Critical Defect Proportion"
          description="Discover the proportion of critical defects across different production shifts"
        >
          <div className="w-full">
            <BarChart
              xAxis={[
                {
                  data: shifts,
                  scaleType: "band",
                  label: "Shift",
                },
              ]}
              yAxis={[
                {
                  label: "Proportion",
                  max: Math.max(
                    shiftUCL + 0.01,
                    Math.max(...shiftData.map((d) => d.proportion)) + 0.01
                  ),
                },
              ]}
              series={[
                {
                  data: shiftData.map((d) => d.proportion),
                  label: "Critical Defect Proportion",
                  color: "blue",
                },
              ]}
              height={360}
            >
              <ChartsReferenceLine
                y={shiftUCL}
                label="UCL"
                labelStyle={{
                  fill: "red",
                  fontFamily: "Figtree",
                  fontSize: "12px",
                }}
                lineStyle={{ stroke: "red", strokeDasharray: "5,5" }}
              />
              <ChartsReferenceLine
                y={shiftLCL}
                label="LCL"
                labelStyle={{
                  fill: "red",
                  fontFamily: "Figtree",
                  fontSize: "12px",
                }}
                lineStyle={{ stroke: "red", strokeDasharray: "5,5" }}
              />
              <ChartsReferenceLine
                y={meanProportion}
                label="Mean"
                labelStyle={{
                  fill: "green",
                  fontFamily: "Figtree",
                  fontSize: "12px",
                }}
                lineStyle={{ stroke: "green" }}
              />
            </BarChart>
          </div>
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <ChartCard
          showIcon={false}
          title="Defects Analysis"
          description="Visualize the most frequent defects and their cumulative impact"
        >
          <div className="w-full grid grid-cols-2 gap-4">
            <BarChart
              xAxis={[
                {
                  data: paretoData.map((d) => d.defect),
                  scaleType: "band",
                  label: "Defect Name",
                  valueFormatter: (value) => value.replace(/\s+/g, "\n"),
                  height: 80,
                },
              ]}
              yAxis={[
                {
                  label: "Frequency",
                  max: Math.max(...paretoData.map((d) => d.count)) + 1,
                },
              ]}
              series={[
                {
                  data: paretoData.map((d) => d.count),
                  label: "Defect Frequency",
                  color: "blue",
                },
              ]}
              height={360}
            />
            <LineChart
              xAxis={[
                {
                  data: paretoData.map((d) => d.defect),
                  scaleType: "band",
                  label: "Defect Name",
                  valueFormatter: (value) => value.replace(/\s+/g, "\n"),
                  height: 80,
                },
              ]}
              yAxis={[
                {
                  label: "Cumulative Percentage",
                  min: 0,
                  max: 100,
                },
              ]}
              series={[
                {
                  data: paretoData.map((d) => d.cumulativePercentage),
                  label: "Cumulative Percentage",
                  color: "red",
                },
              ]}
              height={360}
            >
              <ChartsReferenceLine
                y={80}
                label="80%"
                labelStyle={{
                  fill: "red",
                  fontFamily: "Figtree",
                  fontSize: "12px",
                }}
                lineStyle={{ stroke: "red", strokeDasharray: "5,5" }}
              />
            </LineChart>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analysis;
