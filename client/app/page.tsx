import Image from "next/image";

export default function Home() {
  // Dummy data for BLE beacons
  const beaconData = [
    {
      id: 1,
      device_id: "BLE-001",
      mac_address: "AA:BB:CC:DD:EE:01",
      rssi: -65,
      timestamp: "2025-12-10 14:30:15",
    },
    {
      id: 2,
      device_id: "BLE-002",
      mac_address: "AA:BB:CC:DD:EE:02",
      rssi: -72,
      timestamp: "2025-12-10 14:30:18",
    },
    {
      id: 3,
      device_id: "BLE-003",
      mac_address: "AA:BB:CC:DD:EE:03",
      rssi: -58,
      timestamp: "2025-12-10 14:30:22",
    },
    {
      id: 4,
      device_id: "BLE-004",
      mac_address: "AA:BB:CC:DD:EE:04",
      rssi: -80,
      timestamp: "2025-12-10 14:30:25",
    },
    {
      id: 5,
      device_id: "BLE-005",
      mac_address: "AA:BB:CC:DD:EE:05",
      rssi: -69,
      timestamp: "2025-12-10 14:30:28",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          BLE Beacon Scanner
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {beaconData.map((beacon) => (
                <tr key={beacon.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {beacon.device_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {beacon.mac_address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {beacon.rssi} dBm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {beacon.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
