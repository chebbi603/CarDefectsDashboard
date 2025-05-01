import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Overview from "./pages/Dashboard/SubPages/Overview";
import * as XLSX from "xlsx";
import { Suspense, useEffect, useState } from "react";
import TablePage from "./pages/Table/TablePage";
import Analysis from "./pages/Dashboard/SubPages/Analysis";
import Alerts from "./pages/Dashboard/SubPages/Alerts";
import Cases from "./pages/Cases/Cases";
import CaseView from "./pages/Cases/CaseView";
import CaseContainer from "./pages/Cases/CaseContainer";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/src/assets/dataset.xlsm");
        const ab = await res.arrayBuffer();
        const workbook = XLSX.read(ab, { type: "array" });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws, {
          defval: "",
          raw: true,
          dateNF: "HH:mm:ss",
        });

        // Process the data and convert Excel time values to proper time format
        const processedData = jsonData.map((item, index) => {
          const processed = { ...item };
          if (processed["Defect Name"]) {
            let defectName = processed["Defect Name"]
              .trim()
              .toLowerCase()
              .replace(/\s+/g, " ");

            // Word-level corrections for common typos
            const defectCorrections = {
              "loose wiring": "Loose Wiring",
              "hydraulic leak": "Hydraulic Leak",
              "faulty battery": "Faulty Battery",
              "sensor failure": "Sensor Failure",
              "cracked windshield": "Cracked Windshield",
              "paint scratch": "Paint Scratch",
              "brake malfunction": "Brake Malfunction",
              "rcacked windshield": "Cracked Windshield",
              "crackedw indshield": "Cracked Windshield",
              "faulyt battery": "Faulty Battery",
              "faulty battrey": "Faulty Battery",
              "cracked windshiedl": "Cracked Windshield",
              "loose wiirng": "Loose Wiring",
              "fualty battery": "Faulty Battery",
              "faulty abttery": "Faulty Battery",
              "afulty battery": "Faulty Battery",
              "losoe wiring": "Loose Wiring",
              "faultyb attery": "Faulty Battery",
              "cracekd windshield": "Cracked Windshield",
              "loose iwring": "Loose Wiring",
              "brake malfunciton": "Brake Malfunction",
              "panit scratch": "Paint Scratch",
              "cracked wnidshield": "Cracked Windshield",
              "cracked windsiheld": "Cracked Windshield",
              "apint scratch": "Paint Scratch",
              "cracked winsdhield": "Cracked Windshield",
              "brake malfucntion": "Brake Malfunction",
              "paint scracth": "Paint Scratch",
              "loose wriing": "Loose Wiring",
              "looes wiring": "Loose Wiring",
              "cracked widnshield": "Cracked Windshield",
              "faulty btatery": "Faulty Battery",
              "faulty batetry": "Faulty Battery",
              "piant scratch": "Paint Scratch",
              "carcked windshield": "Cracked Windshield",
              "crcaked windshield": "Cracked Windshield",
              "hydrualic leak": "Hydraulic Leak",
              "loos ewiring": "Loose Wiring",
              "loosew iring": "Loose Wiring",
              "paint csratch": "Paint Scratch",
              "cracke dwindshield": "Cracked Windshield",
              "paint scrathc": "Paint Scratch",
              "loose wirign": "Loose Wiring",
              "cracked windsheild": "Cracked Windshield",
              "paint scrtach": "Paint Scratch",
              "olose wiring": "Loose Wiring",
              "cracked windhsield": "Cracked Windshield",
              "cracked iwndshield": "Cracked Windshield",
              "fautly battery": "Faulty Battery",
              "loose wirnig": "Loose Wiring",
              "faulty batteyr": "Faulty Battery",
              "hydraluic leak": "Hydraulic Leak",
              "brak emalfunction": "Brake Malfunction",
              "sesnor failure": "Sensor Failure",
              "brake malfuntcion": "Brake Malfunction",
              "hydrauilc leak": "Hydraulic Leak",
              "hydraulic elak": "Hydraulic Leak",
              "esnsor failure": "Sensor Failure",
              "hydraulic laek": "Hydraulic Leak",
              "paint srcatch": "Paint Scratch",
              "paint scartch": "Paint Scratch",
              "cracked windshiled": "Cracked Windshield",
              "faluty battery": "Faulty Battery",
              "hydrauli cleak": "Hydraulic Leak",
              "sensor fialure": "Sensor Failure",
              "hydraulicl eak": "Hydraulic Leak",
              "paints cratch": "Paint Scratch",
            };

            defectName =
              defectCorrections[defectName] ||
              defectName
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            processed["Defect Name"] = defectName;
          }
          // Normalize station names
          if (processed.Station) {
            // Standard station names for reference
            const standardNames = [
              "Tire And Rim Installation",
              "Dashboard Installation",
              "Second Row Seats Installation",
              "Rear Bumper Installation",
              "Wire Harness Installation",
              "EV Battery Installation",
              "Steering Wheel Installation",
              "Axle Installation",
              "Headlight Installation",
              "Windshield Installation",
              "First Row Seats Installation",
            ];

            let station = processed.Station.trim()
              .toLowerCase()
              .replace(/\s+/g, " ")
              // Remove duplicate "installation" words
              .replace(/\b(i+nstall?[a-z]*)\s+installation\b/gi, "installation")
              // Fix common installation typos
              .replace(
                /\b(install?[a-z]*|i+nstall?[a-z]*)\b/gi,
                "installation"
              );

            // Word-level corrections
            const corrections = {
              axel: "Axle",
              xael: "Axle",
              evb: "EV",
              ve: "EV",
              wier: "Wire",
              wrie: "Wire",
              iwre: "Wire",
              wireh: "Wire",
              hraness: "Harness",
              hanress: "Harness",
              harenss: "Harness",
              ahrness: "Harness",
              arness: "Harness",
              rera: "Rear",
              erar: "Rear",
              raer: "Rear",
              rea: "Rear",
              rbumper: "Bumper",
              dsah: "Dash",
              dahs: "Dash",
              adsh: "Dash",
              boar: "Board",
              dashboar: "Dashboard",
              dasbhoard: "Dashboard",
              dashboadr: "Dashboard",
              dashborad: "Dashboard",
              dsahboard: "Dashboard",
              dashbaord: "Dashboard",
              adshboard: "Dashboard",
              dahsboard: "Dashboard",
              tir: "Tire",
              tier: "Tire",
              itre: "Tire",
              irm: "Rim",
              drim: "Rim",
              eand: "And",
              an: "And",
              tseering: "Steering",
              steerign: "Steering",
              steerin: "Steering",
              gwheel: "Wheel",
              hweel: "Wheel",
              wehel: "Wheel",
              wheeli: "Wheel",
              fisrt: "First",
              orw: "Row",
              rwo: "Row",
              setas: "Seats",
              esats: "Seats",
              headlgiht: "Headlight",
              windshiled: "Windshield",
              windhsield: "Windshield",
              windshiedl: "Windshield",
              widnshield: "Windshield",
              iwndshield: "Windshield",
              winsdhield: "Windshield",
              batetry: "Battery",
              batteyr: "Battery",
              batteryi: "Battery",
              abttery: "Battery",
              attery: "Battery",
              escond: "Second",
              axeli: "Axle",
              andr: "And",
              diinstallation: "Installation",
              siinstallation: "Installation",
              iinstallation: "Installation",
              installaiton: "Installation",
              installatino: "Installation",
              instlalation: "Installation",
              installatoin: "Installation",
              installtion: "Installation",
              intsallation: "Installation",
              im: "Rim",
              nstallation: "Installation",
              isntallation: "Installation",
              insatllation: "Installation",
              nistallation: "Installation",
              dinstallation: "Installation",
              nstalation: "Installation",
            };

            // Fix common typos in words
            station = station
              .split(" ")
              .map((word) => {
                // Check for word-level corrections first
                const corrected = corrections[word];
                if (corrected) return corrected;

                // Capitalize first letter for other words
                return word.charAt(0).toUpperCase() + word.slice(1);
              })
              .join(" ");

            // Additional normalization for compound names
            station = station
              .replace(/Tire\s+(?:Eand|An|Andr)\s+(?:Rim|Im)/g, "Tire And Rim")
              .replace(
                /Second\s+Rows?\s+(?:Eats|Seat\s+S)/g,
                "Second Row Seats"
              )
              .replace(/Windshield(?:i)?/g, "Windshield");

            // Match with standard names
            const matchingStation = standardNames.find((name) => {
              const normalizedName = name.toLowerCase().replace(/[\s-]+/g, "");
              const normalizedStation = station
                .toLowerCase()
                .replace(/[\s-]+/g, "");

              return normalizedName === normalizedStation;
            });

            processed.Station = matchingStation || station;
          }

          // Handle time conversion
          if (processed.Time) {
            const timeValue = processed.Time;
            if (typeof timeValue === "number") {
              const totalSeconds = Math.round(timeValue * 24 * 60 * 60);
              const hours = Math.floor(totalSeconds / 3600);
              const minutes = Math.floor((totalSeconds % 3600) / 60);
              const seconds = totalSeconds % 60;
              processed.Time = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            }
          }
          return { id: index + 1, ...processed };
        });

        setData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [selectedAxisData, setSelectedAxisData] = useState(null);

  const sendItemData = (data) => {
    setSelectedItemData(data);
    setIsSidebarOpen(true);
  };

  const sendRowData = (params) => {
    setRowData(params.row);
    setIsSidebarOpen(true);
  };

  const sendAxisData = (data) => {
    setSelectedAxisData(data);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout
              openSidebar={isSidebarOpen}
              axisData={selectedAxisData}
              itemData={selectedItemData}
              closeLeftBar={closeSidebar}
              rowData={rowData}
            />
          }
        >
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<h1>Home</h1>} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route
              index
              element={<Navigate to="/dashboard/overview" replace />}
            />
            <Route
              path="overview"
              element={
                <Suspense fallback={<p>Loading</p>}>
                  <Overview
                    data={data}
                    sendAxisData={sendAxisData}
                    sendItemData={sendItemData}
                  />
                </Suspense>
              }
            />
            <Route path="analysis" element={<Analysis data={data} />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
          <Route path="cases" element={<CaseContainer />}>
            <Route index element={<Cases />} />
            <Route path=":caseid" element={<CaseView />} />
          </Route>
          <Route
            path="list"
            element={<TablePage data={data} sendRowData={sendRowData} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
