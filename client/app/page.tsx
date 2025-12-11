"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState, useMemo } from "react";

// Generate comprehensive dummy data
const generateDummyData = () => {
  const devices = ["BLE-001", "BLE-002", "BLE-003", "BLE-004", "BLE-005"];
  const data = [];
  const now = new Date();
  
  // Generate data for the last 24 hours (hourly intervals)
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    devices.forEach((deviceId, idx) => {
      const rssi = -50 - Math.random() * 40; // RSSI between -50 and -90
      data.push({
        id: data.length + 1,
        device_id: deviceId,
        mac_address: `AA:BB:CC:DD:EE:0${idx + 1}`,
        rssi: Math.round(rssi),
        timestamp: timestamp.toISOString(),
        hour: timestamp.getHours(),
      });
    });
  }
  
  return data;
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);

  // Generate data client-side only to prevent hydration mismatch
  const beaconData = useMemo(() => generateDummyData(), []);

  // Calculate statistics
  const totalBeacons = beaconData.length;
  const uniqueDevices = useMemo(() => new Set(beaconData.map((b) => b.device_id)).size, [beaconData]);
  const avgRssi = useMemo(
    () => beaconData.reduce((sum, b) => sum + b.rssi, 0) / beaconData.length,
    [beaconData]
  );
  const strongSignal = useMemo(() => beaconData.filter((b) => b.rssi > -60).length, [beaconData]);
  const weakSignal = useMemo(() => beaconData.filter((b) => b.rssi < -80).length, [beaconData]);
  const mediumSignal = useMemo(() => beaconData.length - strongSignal - weakSignal, [beaconData, strongSignal, weakSignal]);

  // Prepare data for RSSI over time chart (hourly average)
  const rssiOverTime = useMemo(
    () =>
      Array.from({ length: 24 }, (_, hour) => {
        const hourData = beaconData.filter((b) => b.hour === hour);
        const avgRssi =
          hourData.length > 0
            ? hourData.reduce((sum, b) => sum + b.rssi, 0) / hourData.length
            : 0;
        return {
          hour: `${hour}:00`,
          avgRssi: Math.round(avgRssi),
          count: hourData.length,
        };
      }),
    [beaconData]
  );

  // Prepare data for RSSI by device
  const rssiByDevice = useMemo(
    () =>
      Array.from(new Set(beaconData.map((b) => b.device_id))).map((deviceId) => {
        const deviceData = beaconData.filter((b) => b.device_id === deviceId);
        const avgRssi =
          deviceData.reduce((sum, b) => sum + b.rssi, 0) / deviceData.length;
        return {
          device: deviceId,
          avgRssi: Math.round(avgRssi),
          count: deviceData.length,
        };
      }),
    [beaconData]
  );

  // Prepare data for signal strength distribution
  const signalDistribution = useMemo(
    () => [
      { name: "Strong (>-60dBm)", value: strongSignal, color: "#10b981" },
      { name: "Medium (-60 to -80dBm)", value: mediumSignal, color: "#f59e0b" },
      { name: "Weak (<-80dBm)", value: weakSignal, color: "#ef4444" },
    ],
    [strongSignal, mediumSignal, weakSignal]
  );

  // Prepare data for device activity (scans per device)
  const deviceActivity = useMemo(
    () =>
      Array.from(new Set(beaconData.map((b) => b.device_id))).map((deviceId) => {
        const deviceData = beaconData.filter((b) => b.device_id === deviceId);
        return {
          device: deviceId,
          scans: deviceData.length,
        };
      }),
    [beaconData]
  );

  // Get recent beacons (last 10)
  const recentBeacons = useMemo(
    () =>
      [...beaconData]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 10),
    [beaconData]
  );

  // #region agent log
  useEffect(() => {
    setIsMounted(true);
    fetch('http://127.0.0.1:7242/ingest/ead9554f-75d9-495e-8b1d-306849cdb1c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:112',message:'Dashboard component mounted',data:{isClient:typeof window!=='undefined',timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }, []);
  // #endregion agent log

  // #region agent log
  useEffect(() => {
    if (!isMounted) return;
    const checkPortals = () => {
      const portals = document.querySelectorAll('nextjs-portal');
      portals.forEach((portal, idx) => {
        const rect = portal.getBoundingClientRect();
        const styles = window.getComputedStyle(portal);
        fetch('http://127.0.0.1:7242/ingest/ead9554f-75d9-495e-8b1d-306849cdb1c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:130',message:'Portal element detected',data:{index:idx,top:rect.top,left:rect.left,width:rect.width,height:rect.height,position:styles.position,display:styles.display,visibility:styles.visibility,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
      });
    };
    const timeoutId = setTimeout(checkPortals, 100);
    const intervalId = setInterval(checkPortals, 1000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isMounted]);
  // #endregion agent log

  // #region agent log
  useEffect(() => {
    if (!isMounted) return;
    const checkDOMReady = () => {
      const bodyRect = document.body.getBoundingClientRect();
      const htmlRect = document.documentElement.getBoundingClientRect();
      fetch('http://127.0.0.1:7242/ingest/ead9554f-75d9-495e-8b1d-306849cdb1c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:135',message:'DOM dimensions check',data:{bodyWidth:bodyRect.width,bodyHeight:bodyRect.height,htmlWidth:htmlRect.width,htmlHeight:htmlRect.height,scrollY:window.scrollY,scrollX:window.scrollX,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    };
    checkDOMReady();
    window.addEventListener('load', checkDOMReady);
    return () => window.removeEventListener('load', checkDOMReady);
  }, [isMounted]);
  // #endregion agent log

  // #region agent log
  useEffect(() => {
    if (!isMounted) return;
    const fixPortalPosition = (portal: HTMLElement) => {
      const currentPosition = window.getComputedStyle(portal).position;
      if (currentPosition !== 'fixed') {
        portal.style.setProperty('position', 'fixed', 'important');
        portal.style.removeProperty('top');
        portal.style.removeProperty('left');
        portal.style.setProperty('z-index', '9999', 'important');
        const rect = portal.getBoundingClientRect();
        const computedPosition = window.getComputedStyle(portal).position;
        fetch('http://127.0.0.1:7242/ingest/ead9554f-75d9-495e-8b1d-306849cdb1c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:165',message:'Portal fixed via JS',data:{top:rect.top,left:rect.left,width:rect.width,height:rect.height,position:computedPosition,wasAbsolute:currentPosition==='absolute',timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
      }
    };
    const fixAllPortals = () => {
      const portals = document.querySelectorAll('nextjs-portal');
      portals.forEach((portal) => fixPortalPosition(portal as HTMLElement));
    };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'NEXTJS-PORTAL' || (node.nodeType === 1 && (node as Element).tagName === 'NEXTJS-PORTAL')) {
            fixPortalPosition(node as HTMLElement);
          }
        });
      });
      fixAllPortals();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    fixAllPortals();
    const intervalId = setInterval(fixAllPortals, 100);
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [isMounted]);
  // #endregion agent log

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            BLE Beacon Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring and analytics of Bluetooth Low Energy beacons
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Scans
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {totalBeacons}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Devices
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {uniqueDevices}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg RSSI
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {Math.round(avgRssi)} dBm
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Strong Signals
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {strongSignal}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((strongSignal / totalBeacons) * 100)}% of total
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* RSSI Over Time */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Average RSSI Over Time (24h)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rssiOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis label={{ value: "RSSI (dBm)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgRssi"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Avg RSSI"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Signal Strength Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Signal Strength Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={signalDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {signalDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* RSSI by Device */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Average RSSI by Device
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rssiByDevice}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis label={{ value: "RSSI (dBm)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgRssi" fill="#10b981" name="Avg RSSI" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Device Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Device Activity (Scans)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deviceActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis label={{ value: "Number of Scans", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="scans" fill="#8b5cf6" name="Scans" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Beacons Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Beacon Scans
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Device ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    MAC Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    RSSI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Signal Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentBeacons.map((beacon) => {
                  const signalQuality =
                    beacon.rssi > -60
                      ? "Strong"
                      : beacon.rssi > -80
                      ? "Medium"
                      : "Weak";
                  const signalColor =
                    beacon.rssi > -60
                      ? "text-green-600 dark:text-green-400"
                      : beacon.rssi > -80
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400";
                  const timestamp = new Date(beacon.timestamp).toLocaleString();

                  return (
                    <tr
                      key={beacon.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {beacon.device_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {beacon.mac_address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {beacon.rssi} dBm
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${signalColor}`}>
                        {signalQuality}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {timestamp}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
