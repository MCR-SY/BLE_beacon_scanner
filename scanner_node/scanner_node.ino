#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <time.h>
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

    // Timestamp
    // struct tm timeinfo;
    // if (getLocalTime(&timeinfo)) {
    //   char buf[20];
    //   sprintf(buf, "%02d:%02d:%02d", timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);
    //   data.timestamp = String(buf);
    // } else {
    //   data.timestamp = "time_error";
    // }

    // Store into queue
    deviceQueue.push_back(data);

    // Debug Print
    Serial.println("Added to queue:");
    Serial.println(" MAC: " + data.mac);
    Serial.println(" RSSI: " + String(data.rssi));
    // Serial.println(" Time: " + data.timestamp);
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
  pBLEScan->setActiveScan(true);
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);

  // Mesh Setup
  //mesh.setDebugMsgTypes( ERROR | MESH_STATUS | CONNECTION | SYNC | COMMUNICATION | GENERAL | MSG_TYPES | REMOTE ); // all types on
  mesh.setDebugMsgTypes(ERROR | STARTUP);  // set before init() so that you can see startup messages

  mesh.init(MESH_PREFIX, MESH_PASSWORD, &userScheduler, MESH_PORT);
  mesh.onReceive(&receivedCallback);
  mesh.onNewConnection(&newConnectionCallback);
  mesh.onChangedConnections(&changedConnectionCallback);
  mesh.onNodeTimeAdjusted(&nodeTimeAdjustedCallback);

  // Timer based background tasks, so they don't break mesh
  // userScheduler.addTask(taskSendMessage);
  // taskSendMessage.enable();
}

void loop() {
    // it will run the user scheduler as well
  mesh.update();

  // Scan...
  Serial.println("Scanning...");
  BLEScanResults* foundDevices = pBLEScan->start(scanTime, false);
  Serial.printf("Scan complete. %d devices found.\n\n", foundDevices->getCount());

  pBLEScan->clearResults();
  // Send all queued devices AFTER scan
  sendQueuedDevices();

  Serial.println("\nWaiting 2 seconds before next scan...\n");
  delay(2000);
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
    doc["beacon_id"] = d.mac;
    doc["rssi"] = d.rssi;
    //    doc["name"] = d.name;
    //    doc["time"] = d.timestamp;

    String json;
    serializeJson(doc, json);

    bool ok = mesh.sendSingle(ROOT_NODE_ID, json);  // unicast with multi-hop

    // Remove from queue
    deviceQueue.erase(deviceQueue.begin());

    delay(200);
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
