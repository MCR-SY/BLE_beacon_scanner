#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <ArduinoJson.h>
#include <vector>
#include "painlessMesh.h"

// ---------------------- BLE SCAN CONFIG ------------------------------
int scanTime = 5;
BLEScan* pBLEScan;

// ---------------------- MESH NETWORK CONFIG ------------------------------
#define MESH_PREFIX "EspMeshNetwork"
#define MESH_PASSWORD "somethingSneaky"
#define MESH_PORT 5555

// uint32_t ROOT_NODE_ID = 2558284781;  //ESP32 root device id
uint32_t ROOT_NODE_ID = 2445762485;  //ESP8266 root device id

Scheduler userScheduler;  // to control personal tasks
painlessMesh mesh;

//prototypes
void sendQueuedDevices();

Task scanTask(TASK_SECOND * 10, TASK_FOREVER, []() {
  Serial.println("Scanning...");
  BLEScanResults* foundDevices = pBLEScan->start(scanTime, false);
  Serial.printf("Scan complete. %d devices found.\n\n", foundDevices->getCount());
  pBLEScan->clearResults();
  sendQueuedDevices();
});

// ------------------------- DEVICE QUEUE ------------------------------
struct BeaconData {
  String mac;
  int rssi;
  String name;
  String timestamp;
};

std::vector<BeaconData> deviceQueue;

// ---------------------- BLE CALLBACK CLASS ---------------------------
class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice advertisedDevice) {

    BeaconData data;

    // MAC address
    data.mac = advertisedDevice.getAddress().toString().c_str();

    // RSSI
    data.rssi = advertisedDevice.getRSSI();

    // Name (optional)
    if (advertisedDevice.haveName())
      data.name = advertisedDevice.getName().c_str();
    else
      data.name = "unknown";

    // Store into queue
    deviceQueue.push_back(data);

    // Debug Print
    Serial.println("Added to queue:");
    Serial.println(" MAC: " + data.mac);
    Serial.println(" RSSI: " + String(data.rssi));
    Serial.println("----------------------");
  }
};

// --------------------------- SETUP -----------------------------------
void setup() {
  Serial.begin(115200);
  Serial.println();

  // Init time (IST GMT+5:30)
  // configTime(19800, 0, "time.google.com");
  // struct tm timeinfo;
  // while (!getLocalTime(&timeinfo)) {
  //   Serial.println("Waiting for NTP...");
  //   delay(500);
  // }
  // Serial.println("Time Synced!");

  // BLE Setup
  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(false);
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);

  // Mesh Setup
  mesh.setDebugMsgTypes(ERROR | STARTUP | MESH_STATUS);  // set before init() so that you can see startup messages

  mesh.init(MESH_PREFIX, MESH_PASSWORD, &userScheduler, MESH_PORT);
  mesh.onReceive(&receivedCallback);
  mesh.onNewConnection(&newConnectionCallback);
  mesh.onChangedConnections(&changedConnectionCallback);
  mesh.onNodeTimeAdjusted(&nodeTimeAdjustedCallback);

  // Timer based background tasks, so they don't break mesh
  userScheduler.addTask(scanTask);
  scanTask.enable();
}

void loop() {
  // it will run the user scheduler as well
  mesh.update();
}

// ------------------------- SEND TO ROOT NODE ----------------------------
void sendQueuedDevices() {
  if (deviceQueue.empty()) {
    Serial.println("Queue empty. Skipping.");
    return;
  }

  Serial.println("Sending queued devices...");

  while (!deviceQueue.empty()) {
    BeaconData d = deviceQueue.front();

    StaticJsonDocument<200> doc;
    doc["scanner_id"] = mesh.getNodeId();
    doc["beacon_id"] = d.mac;
    doc["rssi"] = d.rssi;
    //    doc["name"] = d.name;

    String json;
    serializeJson(doc, json);

    // mesh.sendBroadcast(json); // broadcast
    bool ok = mesh.sendSingle(ROOT_NODE_ID, json);  // unicast with multi-hop

    if (!ok) {
      Serial.println("Send failed");
    }

    // Remove from queue
    deviceQueue.erase(deviceQueue.begin());
  }

  Serial.println("All queued devices sent.");
}

// ------------------------- OPTIONAL MESH CALLBACKS ----------------------------
// Needed for painless library
void receivedCallback(uint32_t from, String& msg) {
  Serial.printf("->Received from %u msg=%s\n", from, msg.c_str());
}

void newConnectionCallback(uint32_t nodeId) {
  Serial.printf(":-d> New node joined the party! NodeId = %u\n", nodeId);
}

void changedConnectionCallback() {
  Serial.printf("Changed connections\n");
}

void nodeTimeAdjustedCallback(int32_t offset) {
  Serial.printf("Adjusted time %u. Offset = %d\n", mesh.getNodeTime(), offset);
}
