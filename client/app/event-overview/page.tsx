"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

// Dummy data for Event Overview
const visitorTimeData = [
  { time: "09:00", visitors: 200 },
  { time: "10:00", visitors: 400 },
  { time: "11:00", visitors: 600 },
  { time: "12:00", visitors: 800 },
  { time: "13:00", visitors: 1000 },
  { time: "14:00", visitors: 1200 },
  { time: "15:00", visitors: 1400 },
  { time: "16:00", visitors: 1800 },
  { time: "17:00", visitors: 2000 },
  { time: "18:00", visitors: 1500 },
  { time: "19:00", visitors: 800 },
];

const busiestZonesData = [
  { zone: "Hall 4GF", value: 95 },
  { zone: "Hall 5GF", value: 85 },
  { zone: "Hall 5GF (Section 2)", value: 75 },
  { zone: "CCTV Demo Zone", value: 65 },
  { zone: "Access Control Zone", value: 55 },
  { zone: "Fire Safety Pavilion", value: 45 },
];

const scannerIssues = [
  {
    id: "S5",
    hall: "Hall 4",
    stall: "CP Plus",
    issue: "Last Seen",
    severity: "High",
  },
  {
    id: "S12",
    hall: "Hall 5",
    stall: "Hikvision",
    issue: "Last Seen",
    severity: "Medium",
  },
];

// Generate heatmap data (8x8 grid)
const generateHeatmapData = () => {
  const data = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const density = Math.floor(Math.random() * 12);
      data.push({ row: i, col: j, density });
    }
  }
  return data;
};

const heatmapData = generateHeatmapData();

const getHeatmapColor = (density: number) => {
  if (density <= 2) return "bg-green-500";
  if (density <= 4) return "bg-green-400";
  if (density <= 6) return "bg-yellow-400";
  if (density <= 8) return "bg-orange-500";
  if (density <= 10) return "bg-red-500";
  return "bg-red-700";
};

export default function EventOverview() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">IFSEC India 2025</h1>
            <span className="text-gray-400">11-13 Dec 2025</span>
            <span className="text-gray-400">Bharat Mandapam, New Delhi</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Desktop</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">Mobile</span>
            </div>
            <button className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded">View</button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 p-4">
          <div className="space-y-2">
            <div className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer">
              Date
            </div>
            <div className="px-4 py-2 bg-teal-600 rounded text-white font-medium">
              Hall
            </div>
            <div className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer">
              Hall
            </div>
            <div className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer">
              Zone
            </div>
            <div className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer">
              Package Type
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Power BI KPI Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Power BI</h2>
            <div className="grid grid-cols-6 gap-4">
              <div className="bg-teal-600 rounded-lg p-4">
                <p className="text-sm text-teal-100 mb-1">Total Visitors (Unique)</p>
                <p className="text-2xl font-bold">18,420</p>
              </div>
              <div className="bg-teal-600 rounded-lg p-4">
                <p className="text-sm text-teal-100 mb-1">Total Check-Ins Today</p>
                <p className="text-2xl font-bold">7,935</p>
              </div>
              <div className="bg-teal-600 rounded-lg p-4">
                <p className="text-sm text-teal-100 mb-1">Live Visitors Now</p>
                <p className="text-2xl font-bold">2,146</p>
              </div>
              <div className="bg-orange-500 rounded-lg p-4">
                <p className="text-sm text-orange-100 mb-1">Average Dwell Time</p>
                <p className="text-2xl font-bold">47 min</p>
              </div>
              <div className="bg-orange-500 rounded-lg p-4">
                <p className="text-sm text-orange-100 mb-1">Total Stall Visits</p>
                <p className="text-2xl font-bold">52,380</p>
              </div>
              <div className="bg-teal-800 rounded-lg p-4">
                <p className="text-sm text-teal-100 mb-1">Failed Scanners</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Visitors Inside vs Time */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Visitors Inside vs Time (Today)</h3>
                <select className="bg-[#0a0a0a] border border-gray-700 rounded px-3 py-1 text-sm">
                  <option>Visitor Count</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={visitorTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    dot={{ fill: "#14b8a6", r: 4 }}
                  />
                  <text
                    x="70%"
                    y="20%"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Peak Hour: 16:00-17:00
                  </text>
                  <circle cx="70%" cy="20%" r="4" fill="white" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top 10 Busiest Zones / Halls */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Top 10 Busiest Zones / Halls</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={busiestZonesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="zone" type="category" stroke="#666" width={150} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
                  />
                  <Bar dataKey="value" fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Live Crowd Heatmap */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Live Crowd Heatmap</h3>
              <div className="flex gap-6">
                <div className="grid grid-cols-8 gap-1 flex-1">
                  {heatmapData.map((cell, index) => (
                    <div
                      key={index}
                      className={`aspect-square ${getHeatmapColor(cell.density)} rounded`}
                      title={`Density: ${cell.density}`}
                    ></div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold mb-2">Density Scale</div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-xs text-gray-400">0-2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                    <span className="text-xs text-gray-400">2-4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span className="text-xs text-gray-400">4-6</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-xs text-gray-400">6-8</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-xs text-gray-400">8-10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-700 rounded"></div>
                    <span className="text-xs text-gray-400">10-12</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scanner Issues & Alerts */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Scanner Issues & Alerts</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-2 text-gray-400">Scanner ID</th>
                      <th className="text-left py-2 px-2 text-gray-400">Hall</th>
                      <th className="text-left py-2 px-2 text-gray-400">Stall</th>
                      <th className="text-left py-2 px-2 text-gray-400">Issue (Offline / Low Battery)</th>
                      <th className="text-left py-2 px-2 text-gray-400">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scannerIssues.map((issue) => (
                      <tr key={issue.id} className="border-b border-gray-800 hover:bg-gray-900">
                        <td className="py-2 px-2 font-medium">{issue.id}</td>
                        <td className="py-2 px-2 text-gray-300">{issue.hall}</td>
                        <td className="py-2 px-2 text-gray-300">{issue.stall}</td>
                        <td className="py-2 px-2 text-gray-300">{issue.issue}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-white text-xs">⚡</span>
                            </div>
                            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                              <span className="text-white text-xs">🏠</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Link
          href="/"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          ← Stall & Exhibitor
        </Link>
        <Link
          href="/product-zone"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          ← Product & Zone
        </Link>
      </div>
    </div>
  );
}


