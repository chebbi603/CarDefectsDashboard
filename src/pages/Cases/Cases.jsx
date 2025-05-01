import { IconFolderSearch } from "@tabler/icons-react";
import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { calculateQualityScore } from "../../utils/qualityMetrics";
export default function Cases() {
  const navigate = useNavigate();
  const [casesData, setCasesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCases, setFilteredCases] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:3001/get-cases", {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setCasesData(data))
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
        }
      });

    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (casesData.length > 0) {
      setFilteredCases(
        casesData.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, casesData]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <Box sx={{ width: "100%", mb: 2 }}>
        <input
          type="text"
          placeholder="Search for any keyword..."
          className="w-full p-2 border rounded-md search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCases.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 bg-white shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="p-1 pl-2 pr-2 bg-slate-200 text-xs rounded-md w-fit">
                  <p>{item.status?.toUpperCase()}</p>
                </div>
                <div className={`${calculateQualityScore(item).indicator} text-xs px-2 py-1 rounded-md`}>
                  {calculateQualityScore(item).importance}
                </div>
              </div>
              <div>
                <h3 className="font-medium m-0 text-cyan-700 text-lg">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-md mb-2">{item.message}</p>

                <p className="text-gray-500 text-sm">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <Link to={`/cases/${item.id}`}>
                <div className="w-full p-3 text-white bg-cyan-600 flex items-center justify-center">
                  Open Case
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">No cases found</div>
      )}
    </div>
  );
}
