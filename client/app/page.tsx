"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

// Dummy data for Stall & Exhibitor Analysis
const exhibitorData = [
  {
    id: 1,
    name: "CP Plus",
    stall: "S6 S4",
    stallSize: 32.50,
    packageType: "Premium",
    uniqueVisitors: 32.50,
    totalVisits: 48.99,
    avgDwellTime: 29.39,
    bounceRate: 0,
    repeatVisitors: 52580,
    peakTimeSlot: "16:33",
  },
  {
    id: 2,
    name: "Hikvision",
    stall: "SFSS",
    stallSize: 32.50,
    packageType: "Smart",
    uniqueVisitors: 32.50,
    totalVisits: 48.99,
    avgDwellTime: 29.39,
    bounceRate: 0,
    repeatVisitors: 52580,
    peakTimeSlot: "16:39",
  },
  {
    id: 3,
    name: "Hikvision",
    stall: "SP53",
    stallSize: 38.58,
    packageType: "Standard",
    uniqueVisitors: 38.58,
    totalVisits: 24.99,
    avgDwellTime: 69.99,
    bounceRate: 0,
    repeatVisitors: 52580,
    peakTimeSlot: "29:38",
  },
  {
    id: 4,
    name: "Prama",
    stall: "S6 S5",
    stallSize: 38.36,
    packageType: "Premium",
    uniqueVisitors: 38.36,
    totalVisits: 19.44,
    avgDwellTime: 49.07,
    bounceRate: 0,
    repeatVisitors: 52580,
    peakTimeSlot: "16:39",
  },
  {
    id: 5,
    name: "AccessTech Solutions",
    stall: "S6 S6",
    stallSize: 54.36,
    packageType: "Smart",
    uniqueVisitors: 54.36,
    totalVisits: 49.58,
    avgDwellTime: 46.36,
    bounceRate: 0,
    repeatVisitors: 57520,
    peakTimeSlot: "16:36",
  },
  {
    id: 6,
    name: "AccessTech Solutions",
    stall: "SP 50",
    stallSize: 38.62,
    packageType: "Standard",
    uniqueVisitors: 38.62,
    totalVisits: 29.94,
    avgDwellTime: 49.97,
    bounceRate: 0,
    repeatVisitors: 55520,
    peakTimeSlot: "16:96",
  },
  {
    id: 7,
    name: "Dahua",
    stall: "S7 S3",
    stallSize: 34.37,
    packageType: "Premium",
    uniqueVisitors: 34.37,
    totalVisits: 25.99,
    avgDwellTime: 26.39,
    bounceRate: 0,
    repeatVisitors: 52580,
    peakTimeSlot: "29:23",
  },
  {
    id: 8,
    name: "Unnamed",
    stall: "37 55",
    stallSize: 49.97,
    packageType: "Smart",
    uniqueVisitors: 49.97,
    totalVisits: 19.32,
    avgDwellTime: 49.15,
    bounceRate: 0,
    repeatVisitors: 52980,
    peakTimeSlot: "16:34",
  },
];

const topExhibitorsData = [
  { exhibitor: "1", visitors: 25 },
  { exhibitor: "2", visitors: 35 },
  { exhibitor: "3", visitors: 45 },
  { exhibitor: "4", visitors: 55 },
  { exhibitor: "5", visitors: 65 },
  { exhibitor: "6", visitors: 75 },
  { exhibitor: "7", visitors: 85 },
  { exhibitor: "8", visitors: 95 },
  { exhibitor: "9", visitors: 105 },
  { exhibitor: "10", visitors: 110 },
];

const avgDwellTimeData = [
  { exhibitor: "1", time: 85 },
  { exhibitor: "2", time: 75 },
  { exhibitor: "3", time: 70 },
  { exhibitor: "4", time: 65 },
  { exhibitor: "5", time: 60 },
  { exhibitor: "6", time: 55 },
  { exhibitor: "7", time: 50 },
  { exhibitor: "8", time: 45 },
  { exhibitor: "9", time: 40 },
  { exhibitor: "10", time: 35 },
];

const visitsOverTimeData = [
  { hour: "1", visits: 50 },
  { hour: "2", visits: 75 },
  { hour: "3", visits: 100 },
  { hour: "4", visits: 120 },
  { hour: "5", visits: 180 },
  { hour: "16", visits: 150 },
  { hour: "17", visits: 100 },
];

export default function StallExhibitorAnalysis() {
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
            <h2 className="text-xl font-semibold">Stall & Exhibitor Analysis</h2>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 p-4">
          <div className="space-y-2">
            <div className="px-4 py-2 bg-teal-600 rounded text-white font-medium">
              Hall
            </div>
            <div className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer">
              Stall Size (Small / Medium / Large)
            </div>
            <div className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer">
              Package Type (Standard / Smart / Premium)
            </div>
            <div className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer">
              Exhibitor
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Stalls Visited per Visitor</p>
                  <p className="text-2xl font-bold text-white mt-1">7.3</p>
                </div>
                <div className="w-10 h-10 bg-teal-500/20 rounded flex items-center justify-center">
                  <span className="text-teal-400">KPI</span>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Time in Exhibition per Visitor</p>
                  <p className="text-2xl font-bold text-white mt-1">2h 15m</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Stall Visits</p>
                  <p className="text-2xl font-bold text-white mt-1">52,380</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Smart Booths Active</p>
                  <p className="text-2xl font-bold text-white mt-1">118</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Exhibitor Performance Table */}
            <div className="col-span-2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Exhibitor Performance</h3>
                <select className="bg-[#0a0a0a] border border-gray-700 rounded px-3 py-1 text-sm">
                  <option>Q Current</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-2 text-gray-400">Exhibitor Name</th>
                      <th className="text-left py-2 px-2 text-gray-400">Stall/Row</th>
                      <th className="text-left py-2 px-2 text-gray-400">Stall Size (sqm)</th>
                      <th className="text-left py-2 px-2 text-gray-400">Package Type</th>
                      <th className="text-left py-2 px-2 text-gray-400">Unique Visitors</th>
                      <th className="text-left py-2 px-2 text-gray-400">Total Visits</th>
                      <th className="text-left py-2 px-2 text-gray-400">Avg Dwell Time (min)</th>
                      <th className="text-left py-2 px-2 text-gray-400">Bounce Rate (%)</th>
                      <th className="text-left py-2 px-2 text-gray-400">Repeat Visitors</th>
                      <th className="text-left py-2 px-2 text-gray-400">Peak Time Slot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exhibitorData.map((exhibitor) => (
                      <tr key={exhibitor.id} className="border-b border-gray-800 hover:bg-gray-900">
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                            <span>{exhibitor.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-gray-300">{exhibitor.stall}</td>
                        <td className="py-2 px-2 text-gray-300">{exhibitor.stallSize}</td>
                        <td className="py-2 px-2 text-gray-300">{exhibitor.packageType}</td>
                        <td className="py-2 px-2 text-gray-300">{exhibitor.uniqueVisitors}</td>
                        <td className="py-2 px-2 text-gray-300">{exhibitor.totalVisits}</td>
                        <td className="py-2 px-2 text-gray-300">{exhibitor.avgDwellTime}</td>
                        <td className="py-2 px-2 text-gray-300">{exhibitor.bounceRate}%</td>
                        <td className="py-2 px-2 text-gray-300">{exhibitor.repeatVisitors.toLocaleString()}</td>
                        <td className="py-2 px-2 text-gray-300">{exhibitor.peakTimeSlot}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <button className="px-3 py-1 text-gray-400 hover:text-white">2</button>
                <button className="px-3 py-1 text-gray-400 hover:text-white">3</button>
                <button className="px-3 py-1 bg-teal-600 text-white rounded">n</button>
                <button className="px-3 py-1 text-gray-400 hover:text-white">4</button>
                <button className="px-3 py-1 text-gray-400 hover:text-white">5</button>
                <button className="px-3 py-1 text-gray-400 hover:text-white">6</button>
                <button className="px-3 py-1 text-gray-400 hover:text-white">8</button>
                <button className="px-3 py-1 text-gray-400 hover:text-white">m</button>
              </div>
            </div>

            {/* Right Panel Charts */}
            <div className="space-y-6">
              {/* Top Exhibitors by Unique Visitors */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Top Exhibitors by Unique Visitors</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topExhibitorsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="exhibitor" stroke="#666" />
                    <YAxis stroke="#666" domain={[0, 110]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
                    />
                    <Bar dataKey="visitors" fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Avg Dwell Time by Exhibitor */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Avg Dwell Time by Exhibitor</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={avgDwellTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="exhibitor" stroke="#666" />
                    <YAxis stroke="#666" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
                    />
                    <Bar dataKey="time" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pop-up Detail Window (CP Plus) */}
          <div className="mt-6 bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 w-96">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <h3 className="text-lg font-semibold">CP Plus</h3>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <span className="text-sm text-gray-400">Peak Hour:</span>
                <span className="ml-2 text-white">14:00-15:00</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Share of Total Visitors:</span>
                <span className="ml-2 text-white">12%</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Visits Over Time (Today)</h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={visitsOverTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="hour" stroke="#666" />
                  <YAxis stroke="#666" domain={[0, 300]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#14b8a6" strokeWidth={2} dot={{ fill: "#14b8a6" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Link
          href="/product-zone"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          Product & Zone Analysis →
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
