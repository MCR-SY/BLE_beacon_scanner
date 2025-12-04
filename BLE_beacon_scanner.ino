#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <time.h>
#include <ArduinoJson.h>
#include <vector>

// ------------------------- WIFI CONFIG -------------------------------
const char* ssid = "Airtel_vsvai";
const char* password = "lenovoturbo";

// FastAPI URL
const char* serverName = "http://192.168.1.12:8000/api/record-data";

//const char* serverName = "http://glpjr3lm-5173.inc1.devtunnels.ms/api/record-data";


// ---------------------- BLE SCAN CONFIG ------------------------------
int scanTime = 5;
BLEScan* pBLEScan;

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
    struct tm timeinfo;
    if (getLocalTime(&timeinfo)) {
      char buf[20];
      sprintf(buf, "%02d:%02d:%02d", timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);
      data.timestamp = String(buf);
    } else {
      data.timestamp = "time_error";
    }

    // Store into queue
    deviceQueue.push_back(data);

    // Debug Print
    Serial.println("Added to queue:");
    Serial.println(" MAC: " + data.mac);
    Serial.println(" RSSI: " + String(data.rssi));
    Serial.println(" Time: " + data.timestamp);
    Serial.println("----------------------");
  }
};

// --------------------------- SETUP -----------------------------------
void setup() {
  Serial.begin(115200);
  Serial.println();

  // Connect WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());

  // Init time (IST GMT+5:30)
  configTime(19800, 0, "time.google.com");
  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    Serial.println("Waiting for NTP...");
    delay(500);
  }
  Serial.println("Time Synced!");

  // BLE Setup
  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);
}

// ------------------------- SEND TO SERVER ----------------------------
void sendQueuedDevices() {
  if (deviceQueue.empty()) {
    Serial.println("Queue empty. Skipping POST.");
    return;
  }

  Serial.println("Posting queued devices...");

  while (!deviceQueue.empty()) {
    BeaconData d = deviceQueue.front();

    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["beacon_id"] = d.mac;
    doc["rssi"] = d.rssi;
//    doc["name"] = d.name;
//    doc["time"] = d.timestamp;

    String json;
    serializeJson(doc, json);

    int code = http.POST(json);

    Serial.print("POST -> ");
    Serial.print(json);
    Serial.print(" | Response: ");
    Serial.println(code);

    http.end();

    // Remove from queue
    deviceQueue.erase(deviceQueue.begin());

    delay(200);
  }

  Serial.println("All queued devices posted.");
}

// ----------------------------- LOOP ----------------------------------
void loop() {

  Serial.println("Scanning...");
  BLEScanResults *foundDevices = pBLEScan->start(scanTime, false);
  Serial.printf("Scan complete. %d devices found.\n\n", foundDevices->getCount());

  pBLEScan->clearResults();

  // Send all queued devices AFTER scan
  sendQueuedDevices();

  Serial.println("\nWaiting 2 seconds before next scan...\n");
  delay(2000);
}
