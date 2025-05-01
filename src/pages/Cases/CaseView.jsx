import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ChartCard from "../../components/ChartCard/ChartCard";

export default function CaseView() {
  const { caseid } = useParams();
  const [displayData, setDisplayData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch case data
  useEffect(() => {
    const controller = new AbortController();
    fetch(`http://localhost:3001/get-case/${caseid}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setDisplayData([data]))
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
        }
      });

    return () => controller.abort();
  }, [caseid]);

  // Fetch messages
  useEffect(() => {
    const controller = new AbortController();
    fetch(`http://localhost:3001/get-case-messages/${caseid}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setMessages(data))
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
        }
      });

    return () => controller.abort();
  }, [caseid]);

  console.log(displayData);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    fetch(`http://localhost:3001/add-message-to-case/${caseid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newMessage,
        sender: "User", // You can replace with actual user name
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to send message");
        return res.json();
      })
      .then((data) => {
        setMessages([...messages, data]);
        setNewMessage("");
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="mb-6">
        <Link to={"/cases"}>
          <div className="text-slate-500 hover:text-cyan-700 transition-colors flex gap-2">
            <IconArrowLeft />
            <p className="text-md font-medium">{"Return to cases"}</p>
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="grid-chart-container h-full max-h-140">
          <div className="w-full p-4 h-full">
            <div className="h-full flex flex-col">
              {/* Replace the chat section with this */}
              <div className="flex-1 overflow-y-auto mb-4 h-full">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className="mb-3 p-3 bg-slate-100 rounded-md"
                    >
                      <div className="flex justify-between items-baseline">
                        <p className="font-medium text-cyan-700">
                          {msg.sender}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-gray-800 mt-1">{msg.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4 h-full">
                    No messages yet
                  </div>
                )}
              </div>
              <div className="border-t border-slate-200 pt-4">
                <input
                  className="w-full p-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Type your message here..."
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div
                  className="mt-2 bg-cyan-600 text-white px-8 py-3 font-medium  hover:bg-cyan-700 transition-colors w-fit"
                  onClick={handleSendMessage}
                >
                  Send Message
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-chart-container h-fit ">
          {displayData.map((item, index) => (
            <div className="relative w-full h-fit flex flex-col" key={index}>
              <div className="p-1 pl-2 pr-2 bg-slate-200 text-xs rounded-md w-fit mb-2">
                <p>{item.status?.toUpperCase()}</p>
              </div>
              <p className="font-medium text-3xl text-cyan-700 mb-2">
                {item.title}
              </p>
              <p className="text-gray-700 text-md mb-2">{item.message}</p>
              <p className="text-gray-500 text-xs mb-4">
                {new Date(item.date).toLocaleDateString()}
              </p>
              <div className="text-cyan-800 text-sm bg-cyan-100 p-2 w-100 rounded-md">
                <table className="text-cyan-800 text-sm bg-cyan-100">
                  <tbody>
                    {item.data.map((dataItem, dataIndex) => (
                      <React.Fragment key={dataIndex}>
                        {Object.entries(dataItem).map(([key, value]) => (
                          <tr key={key}>
                            <td className="font-medium p-1 pr-2 w-40">
                              {key}:
                            </td>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
