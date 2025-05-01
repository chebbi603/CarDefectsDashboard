import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3001;

// Define

app.use(cors());
app.use(bodyParser.json());

// In-memory data stores
let cases = [
  {
    title: "Problem with wires",
    message:
      "I have noticed this defect with a high severity rating. Please help.",
    type: "Anomaly",
    status: "Under review",
    date: "2025-05-01T19:21:45.995Z",
    messsages: [],
    data: [
      {
        id: 1,
        Date: "23.06.23",
        Time: "12:00:00",
        "Defect Name": "Loose Wiring",
        Station: "Tire And Rim Installation",
        "Part of the Car": "Door Panel",
        "Reporter Name": "Chris Lee",
        "Part Number": 875001,
        "Severity Rating": 10,
        "Car Model": "Base",
        "Motor Type": "Long Range",
        "Design Package": "Offroad",
        "Production Shift": "Morning",
        "Resolution Time (in hours)": 8,
        "Root Cause Identified": "Yes",
        "Defect Category": "Cosmetic",
      },
    ],
    id: "1746127305998",
    messages: [
      {
        text: "Case created",
        sender: "SYSTEM",
        timestamp: "2025-05-01T19:21:45.998Z",
      },
    ],
  },
];

let alerts = [
  [
    {
      id: 2,
      title: "Average Resolution time: Out of Control Points Detected",
      date: "26.05.23",
      url: "/dashboard/analysis",
    },
  ],
];

app.post("/add-case", (req, res) => {
  const caseData = req.body;
  caseData.id = Date.now().toString();
  caseData.messages = [
    {
      text: "Case created",
      sender: "SYSTEM",
      timestamp: new Date().toISOString(),
    },
  ];
  cases.push(caseData);
  res.status(200).send("Case added successfully");
});

app.post("/send-alert", (req, res) => {
  const requestData = req.body;
  alerts.push(requestData);
  res.status(200).send("Alert added successfully");
});

app.get("/get-alerts", (req, res) => {
  // Filter out duplicates by checking unique IDs
  const uniqueAlerts = alerts.reduce((acc, current) => {
    const exists = acc.some((alert) => alert.id === current.id);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  res.status(200).json(uniqueAlerts);
});

app.get("/get-cases", (req, res) => {
  res.status(200).json(cases);
});

app.get("/get-case/:id", (req, res) => {
  const caseId = req.params.id;
  const foundCase = cases.find((c) => c.id === caseId);

  if (foundCase) {
    res.status(200).json(foundCase);
  } else {
    res.status(404).json({ message: "Case not found" });
  }
});

app.get("/get-case-messages/:id", (req, res) => {
  const caseId = req.params.id;
  const foundCase = cases.find((c) => c.id === caseId);

  if (foundCase) {
    res.status(200).json(foundCase.messages || []);
  } else {
    res.status(404).json({ message: "Case not found" });
  }
});

app.post("/add-message-to-case/:id", (req, res) => {
  const caseId = req.params.id;
  const { text, sender } = req.body;
  const foundCase = cases.find((c) => c.id === caseId);

  if (foundCase) {
    const newMessage = {
      text,
      sender,
      timestamp: new Date().toISOString(),
    };
    foundCase.messages.push(newMessage);
    res.status(200).json(newMessage);
  } else {
    res.status(404).json({ message: "Case not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
