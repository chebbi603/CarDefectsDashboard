import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { Box } from "@mui/material";
import "./tablepage.css";
import { IconInfoCircle, IconTable } from "@tabler/icons-react";
import { useState } from "react";

export default function TablePage({ data, sendRowData }) {
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    { field: "id", headerName: "Identifier", width: 80 },
    { field: "Date", headerName: "Date", width: 120 },
    { field: "Time", headerName: "Time", width: 100 },
    { field: "Defect Name", headerName: "Defect Name", width: 150 },
    { field: "Station", headerName: "Station", width: 180 },
    { field: "Part of the Car", headerName: "Part of the Car", width: 150 },
    { field: "Reporter Name", headerName: "Reporter Name", width: 150 },
    { field: "Part Number", headerName: "Part Number", width: 130 },
    { field: "Severity Rating", headerName: "Severity Rating", width: 150 },
    { field: "Car Model", headerName: "Car Model", width: 120 },
    { field: "Motor Type", headerName: "Motor Type", width: 120 },
    { field: "Design Package", headerName: "Design Package", width: 150 },
    { field: "Production Shift", headerName: "Production Shift", width: 150 },
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
    { field: "Defect Category", headerName: "Defect Category", width: 150 },
  ];

  // Initialize filtered data when component mounts or data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Handle search filtering
  useEffect(() => {
    if (searchQuery) {
      const filteredRows = data.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredData(filteredRows);
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="table-page w-full flex flex-col gap-8">
      <div className="dashboard-header flex flex-col gap-2 align-center pt-1">
        <div className="flex flex-row gap-2 align-center header-headline">
          <IconTable size={32} />
          <p className="text-2xl font-medium">List View</p>
        </div>
        <p className="text-sm font-normal">Browse all the data in one table</p>
      </div>
      <Box sx={{ width: "100%", mb: 2 }}>
        <input
          type="text"
          placeholder="Search for any keyword..."
          className="w-full p-2 border rounded-md search-input"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>
      <div className="flex gap-2 p-2 border border-teal-600 bg-teal-100 font-medium rounded-md w-160 text-teal-700">
        <IconInfoCircle />
        <p>Click on any row to create a case</p>
      </div>
      <div style={{ height: "max-content", width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={filteredData}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          onCellClick={sendRowData}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: 600,
              fontFamily: "Figtree",
              borderRadius: "0px",
              color: "#2a7392",
              fontWeight: 800,
            },
          }}
        />
      </div>
    </div>
  );
}
