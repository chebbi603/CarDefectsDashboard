import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link, useNavigate } from "react-router-dom";
import "./Layouts.css";
import { IconColorPicker, IconSelect, IconX } from "@tabler/icons-react";
import IconButton from "../components/IconButton";
gsap.registerPlugin(useGSAP);

const LeftPanel = ({ itemData, axisData, closeLeftBar, rowData }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");

  const [displayData, setDisplayData] = useState([]);
  //   if (itemData) displayData.push({ type: "item", data: itemData });
  useEffect(() => {
    if (axisData) {
      // Check if axisData already exists by comparing stringified objects
      const exists = displayData.some(
        (item) => JSON.stringify(item.data) === JSON.stringify(axisData)
      );

      if (!exists) {
        setDisplayData([...displayData, { type: "axis", data: axisData }]);
        console.log(axisData);
      }
    }
  }, [axisData]);

  useEffect(() => {
    if (rowData && !displayData.some((item) => item.data === rowData)) {
      setDisplayData([...displayData, { type: "row", data: rowData }]);
      console.log(rowData); // Log the rowData valu
    }
  }, [rowData]);

  useGSAP(() => {
    gsap.fromTo(
      ".leftPanel-container",
      { width: 0, opacity: 0 },
      { width: "33%", opacity: 1, ease: 2, duration: 0.3 }
    );
  });

  const isDisabled = !(title && message && dropdownValue);
  const navigate = useNavigate();

  const createCase = (event) => {
    event.preventDefault(); // Prevent the default action of the <a> tag
    if (!isDisabled) {
      const caseObject = {
        title,
        message,
        type: dropdownValue,
        status: "open",
        date: new Date().toISOString(),
        messsages: [],
        data: displayData.reduce((ids, item) => {
          if (item.data && item.data.id) {
            ids.push(item.data);
          } else if (item.data && item.data.Date && item.data.Anomalies)
            ids.push(item.data);
          return ids;
        }, []),
      };

      fetch("http://localhost:3001/add-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseObject),
      })
        .then((response) => {
          if (response.ok) {
            navigate("/cases");
            closeLeftBar(); // Use the navigate function here
          }
          return response.text();
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  return (
    <div className="leftPanel-container flex flex-col gap-8 w-1/3 h-full bg-gray-200">
      <div className="flex flex-row w-full justify-between items-center">
        <div className="flex flex-row gap-1 items-center text-cyan-700 font-medium">
          <IconColorPicker />
          <p className="leftPanel-title text-lg">Inspector</p>
        </div>
        <div onClick={() => closeLeftBar()}>
          <IconButton icon={<IconX />} />
        </div>
      </div>
      <div className="flex flex-col gap-2 h-fit max-h-300 overflow-y-scroll">
        <p className="font-medium text-lg">
          {displayData.length > 0
            ? "Selected data points"
            : "No selected data points"}
        </p>
        {displayData.map((item, index) => (
          <div
            className="relative w-full h-fit flex flex-col bg-cyan-100 p-2 rounded-md cursor-pointer hover:bg-cyan-200"
            key={index}
          >
            <div className="text-cyan-800 text-sm">
              {item.type === "axis" && (
                <table className="text-cyan-800 text-sm">
                  <tbody>
                    {Object.entries(item.data).map(([key, value]) => (
                      <tr key={key}>
                        <td className="font-medium pr-2">{key}:</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {item.type === "row" && (
                <table className="text-cyan-800 text-sm">
                  <tbody>
                    {Object.entries(item.data).map(([key, value]) => (
                      <tr key={key}>
                        <td className="font-medium pr-2">{key}:</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* {item.type === "item" && JSON.stringify(item.data, null, 2)} */}
            </div>
            <div
              className="absolute top-1 right-1 -mt-1 -mr-1"
              onClick={() => {
                const newDisplayData = [...displayData];
                newDisplayData.splice(index, 1);
                setDisplayData(newDisplayData);
              }}
            >
              <IconButton icon={<IconX />} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div>
          <p className="font-medium text-lg mb-1">Create case</p>
          <p className="font-normal text-slate-700 text-sm">
            Inspect and report anomalies.
            <br />
            You will be able to monitor your case progress in the{" "}
            <span>
              <Link
                to="/cases"
                className="font-semibold text-cyan-800"
                style={{ textDecoration: "none" }}
              >
                <b>Cases</b>
              </Link>{" "}
            </span>
            page
          </p>
        </div>
        <input
          className="case-input-title w-full"
          placeholder="Case title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="w-full p-2 case-input-title"
          value={dropdownValue}
          onChange={(e) => setDropdownValue(e.target.value)}
        >
          <option value="" disabled>
            Select case type
          </option>
          <option value="option1">Anomaly</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <textarea
          className="case-input-message w-full text-left align-top"
          placeholder="Describe what is going on exactly"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div
          className={`w-full radius-xs p-4 text-center text-white button ${
            isDisabled ? "disabled" : ""
          }`}
          style={{
            textDecoration: "none",
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
          onClick={createCase}
        >
          Create Case
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
