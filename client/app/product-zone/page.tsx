"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

// Dummy data for Product & Zone Analysis
const scannerData = [
  {
    id: "S1",
    zone: "Zone 1",
    productName: "CCTV Demo Zone",
    status: "OK",
    uniqueVisitors: 45,
    liveVisitors: 9,
    avgDwellTime: 32.5,
    qualifiedLeads: 12,
    lastCommunication: "2 min ago",
    batteryStatus: "OK",
  },
  {
    id: "S2",
    zone: "Zone 2",
    productName: "Access Control Zone",
    status: "OK",
    uniqueVisitors: 52,
    liveVisitors: 8,
    avgDwellTime: 28.3,
    qualifiedLeads: 15,
    lastCommunication: "1 min ago",
    batteryStatus: "OK",
  },
  {
    id: "S5",
    zone: "Zone 3",
    productName: "Fire Safety Zone",
    status: "Low Battery / No Comms",
    uniqueVisitors: 38,
    liveVisitors: 8,
    avgDwellTime: 25.7,
    qualifiedLeads: 8,
    lastCommunication: "15 min ago",
    batteryStatus: "Low",
  },
  {
    id: "S6",
    zone: "Zone 4",
    productName: "Smart Home Zone",
    status: "OK",
    uniqueVisitors: 48,
    liveVisitors: 9,
    avgDwellTime: 35.2,
    qualifiedLeads: 18,
    lastCommunication: "30 sec ago",
    batteryStatus: "OK",
  },
  {
    id: "S7",
    zone: "Zone 5",
    productName: "Perimeter Security Zone",
    status: "OK",
    uniqueVisitors: 42,
    liveVisitors: 8,
    avgDwellTime: 30.1,
    qualifiedLeads: 10,
    lastCommunication: "1 min ago",
    batteryStatus: "OK",
  },
  {
    id: "S8",
    zone: "Zone 6",
    productName: "Biometric Zone",
    status: "OK",
    uniqueVisitors: 55,
    liveVisitors: 8,
    avgDwellTime: 40.5,
    qualifiedLeads: 22,
    lastCommunication: "45 sec ago",
    batteryStatus: "OK",
  },
];

const productsByVisitorsData = [
  { zone: "Zone 5", percentage: 10.9 },
  { zone: "Zone 4", percentage: 12.2 },
  { zone: "Zone 3", percentage: 9.9 },
  { zone: "Zone 2", percentage: 80.0 },
  { zone: "Zone 1", percentage: 2.7 },
];

const conversionFunnelData = [
  { stage: "Zone Visits", value: 1000, color: "#10b981" },
  { stage: "Booth Staff Interactions", value: 350, color: "#f97316" },
  { stage: "Qualified Leads", value: 120, color: "#10b981" },
];

const exhibitors = [
  { name: "CP Plus", selected: true, color: "bg-teal-500" },
  { name: "Hikvision", selected: false, color: "bg-orange-500" },
  { name: "Prama", selected: false, color: "bg-green-500" },
  { name: "Dahua", selected: false, color: "bg-gray-500" },
  { name: "Honeywell", selected: false, color: "bg-gray-500" },
];

export default function ProductZoneAnalysis() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-teal-400 font-semibold">Power BI</span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">IFSEC India 2025</h1>
              <span className="text-gray-400">11-13 Dec 2025</span>
              <span className="text-gray-400">Bharat Mandapam, New Delhi</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Product & Zone Analysis</h2>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 p-4">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Exhibitors</h3>
            <div className="space-y-2">
              {exhibitors.map((exhibitor) => (
                <div
                  key={exhibitor.name}
                  className={`px-4 py-2 rounded cursor-pointer ${
                    exhibitor.selected
                      ? "bg-teal-500/20 border border-teal-500"
                      : exhibitor.color === "bg-orange-500"
                      ? "bg-orange-500/20 border border-orange-500"
                      : exhibitor.color === "bg-green-500"
                      ? "bg-green-500/20 border border-green-500"
                      : "bg-gray-800 border border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${exhibitor.color}`}></div>
                    <span className="text-sm">{exhibitor.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Filters</h3>
            <select className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm">
              <option>Hall</option>
            </select>
            <select className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm">
              <option>Date</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Middle Panel - CP Plus Stall */}
            <div className="col-span-2">
              {/* Scanner Status - Isometric View */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">CP Plus Stall - Scanner Status</h3>
                <div className="relative bg-[#0a0a0a] rounded-lg p-8 h-96 flex items-center justify-center">
                  {/* Simplified isometric representation */}
                  <div className="relative w-full h-full">
                    {/* Stall layout representation */}
                    <div className="absolute inset-0 border-2 border-gray-700 rounded-lg">
                      {/* Display units */}
                      <div className="absolute top-4 left-4 w-16 h-12 bg-gray-700 rounded"></div>
                      <div className="absolute top-4 right-4 w-16 h-12 bg-gray-700 rounded"></div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-gray-700 rounded"></div>
                      
                      {/* Tables */}
                      <div className="absolute top-20 left-8 w-12 h-12 bg-gray-600 rounded"></div>
                      <div className="absolute top-20 right-8 w-12 h-12 bg-gray-600 rounded"></div>
                      
                      {/* Scanners */}
                      <div className="absolute top-8 left-1/4 transform -translate-x-1/2">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-bold">S1</span>
                        </div>
                        <div className="mt-1 text-xs text-center bg-black/50 px-2 py-1 rounded">
                          Live: 9 visitors
                        </div>
                      </div>
                      <div className="absolute top-8 right-1/4 transform translate-x-1/2">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-bold">S2</span>
                        </div>
                        <div className="mt-1 text-xs text-center bg-black/50 px-2 py-1 rounded">
                          Live: 8 visitors
                        </div>
                      </div>
                      <div className="absolute bottom-20 left-1/3 transform -translate-x-1/2">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-bold">S5</span>
                        </div>
                        <div className="mt-1 text-xs text-center bg-black/50 px-2 py-1 rounded">
                          Live: 8 visitors
                        </div>
                        <div className="mt-1 text-xs text-red-400 text-center">Low Battery / No Comms</div>
                      </div>
                      <div className="absolute bottom-20 right-1/3 transform translate-x-1/2">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-bold">S6</span>
                        </div>
                        <div className="mt-1 text-xs text-center bg-black/50 px-2 py-1 rounded">
                          Live: 9 visitors
                        </div>
                      </div>
                      <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-bold">S7</span>
                        </div>
                        <div className="mt-1 text-xs text-center bg-black/50 px-2 py-1 rounded">
                          Live: 8 visitors
                        </div>
                      </div>
                      <div className="absolute bottom-8 right-1/4 transform translate-x-1/2">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-bold">S8</span>
                        </div>
                        <div className="mt-1 text-xs text-center bg-black/50 px-2 py-1 rounded">
                          Live: 8 visitors
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Per-Scanner Metrics Table */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Per-Scanner Metrics (CP Plus)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 px-2 text-gray-400">Scanner ID</th>
                        <th className="text-left py-2 px-2 text-gray-400">Zone / Product Name</th>
                        <th className="text-left py-2 px-2 text-gray-400">Status</th>
                        <th className="text-left py-2 px-2 text-gray-400">Unique Visitors Today</th>
                        <th className="text-left py-2 px-2 text-gray-400">Live Visitors Now</th>
                        <th className="text-left py-2 px-2 text-gray-400">Avg Dwell Time (min)</th>
                        <th className="text-left py-2 px-2 text-gray-400">Qualified Leads</th>
                        <th className="text-left py-2 px-2 text-gray-400">Last Communication</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scannerData.map((scanner) => (
                        <tr key={scanner.id} className="border-b border-gray-800 hover:bg-gray-900">
                          <td className="py-2 px-2 font-medium">{scanner.id}</td>
                          <td className="py-2 px-2 text-gray-300">{scanner.productName}</td>
                          <td className="py-2 px-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                scanner.status === "OK"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {scanner.status}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-gray-300">{scanner.uniqueVisitors}</td>
                          <td className="py-2 px-2 text-gray-300">{scanner.liveVisitors}</td>
                          <td className="py-2 px-2 text-gray-300">{scanner.avgDwellTime}</td>
                          <td className="py-2 px-2 text-gray-300">{scanner.qualifiedLeads}</td>
                          <td className="py-2 px-2 text-gray-300">{scanner.lastCommunication}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Panel - Charts */}
            <div className="space-y-6">
              {/* Products / Zones by Unique Visitors */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Products / Zones by Unique Visitors</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={productsByVisitorsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" stroke="#666" domain={[0, 100]} />
                    <YAxis dataKey="zone" type="category" stroke="#666" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
                      formatter={(value: number) => `${value}%`}
                    />
                    <Bar dataKey="percentage" fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Interest to Lead Conversion */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Interest to Lead Conversion</h3>
                <div className="space-y-3">
                  {conversionFunnelData.map((stage, index) => (
                    <div key={stage.stage} className="relative">
                      <div
                        className="rounded-lg p-4 text-center text-white font-semibold"
                        style={{
                          backgroundColor: stage.color,
                          width: `${(stage.value / conversionFunnelData[0].value) * 100}%`,
                          marginLeft: index === 1 ? "10%" : index === 2 ? "20%" : "0%",
                        }}
                      >
                        {stage.stage}
                        <div className="text-sm mt-1">{stage.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1 text-xs text-gray-400">
                  <div>Zone Visits</div>
                  <div>Booth Staff Interactions</div>
                  <div>Qualified Leads</div>
                </div>
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
          href="/event-overview"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          Event Overview →
        </Link>
      </div>
    </div>
  );
}


