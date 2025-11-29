#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
//ble libraries
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
// extra libraries
#include "time.h"
#include <ArduinoJson.h>

// wifi credentials
const char* ssid = "Airtel_vsvai";
const char* password = "lenovoturbo";

// url to post data
const char* serverName = "http://192.168.1.3:8000/api/record-data";

int scanTime = 5; // seconds
BLEScan* pBLEScan;

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      Serial.printf("Advertised Device: %s \n", advertisedDevice.toString().c_str()); //full data

      // check device name
      if (advertisedDevice.haveName()) {
        Serial.print("Device name: ");
        Serial.println(advertisedDevice.getName().c_str());
        Serial.println("");
      }

      // print mac_address
      String macAddress = advertisedDevice.getAddress().toString().c_str();
      Serial.print("MAC Address: ");
      Serial.println(macAddress);

      // print rssi
      int rssi = advertisedDevice.getRSSI();   // <-- signal strength in dBm
      Serial.printf("RSSI: %d dBm\n", rssi);

      // check for serviceUUID
      if (advertisedDevice.haveServiceUUID()) {
        BLEUUID devUUID = advertisedDevice.getServiceUUID();
        Serial.print("ServiceUUID: ");
        Serial.println(devUUID.toString().c_str());
        Serial.println("");
      }

      // Get current time
      struct tm timeinfo;
      if (getLocalTime(&timeinfo)) {
        Serial.printf("ctime: [%02d:%02d:%02d] \n",
                      timeinfo.tm_hour,
                      timeinfo.tm_min,
                      timeinfo.tm_sec);
      } else {
        Serial.print("[time unavailable] \n\n");
      }

    }
};

void setup() {
  // initializing Serial monitor
  Serial.begin(115200);
  Serial.println();

  // initializing wifi
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println(".");
  }
  Serial.println("");
  Serial.println("Connected to wifi with IP: ");
  Serial.println(WiFi.localIP());

  // Init NTP time
  configTime(19800, 0, "time.google.com"); // GMT+5:30 for India
  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    Serial.println("Waiting for NTP...");
    delay(1000);
  }
  Serial.println("NTP time acquired!\n");

  // BLE scanning setup
  Serial.println("Now scanning ble devices...");
  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); // create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); // faster, but consumes more power
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99); // <= setInterval
}

void loop() {
  // start scanning
  BLEScanResults *foundDevices = pBLEScan->start(scanTime, false);
  Serial.print("Device found: ");
  Serial.println(foundDevices->getCount());
  Serial.println("Scan done!\n\n");
  pBLEScan->clearResults(); // delete results from BLEScan buffer to free memory
  delay(2000);

  // Send HTTP POST request
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    // Domain name with url path
    http.begin(client, serverName);


    // If you need an HTTP request with a content type: application/json, use the following:
    http.addHeader("Content-Type", "application/json");
    // JSON data to send with HTTP POST
    StaticJsonDocument<200> doc;
    doc["beacon_id"] = "1234";
    doc["rssi"] = "12%";
    String httpRequestData;
    serializeJson(doc, httpRequestData);
    // Send HTTP POST request
    int httpResponseCode = http.POST(httpRequestData);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    // free resources
    http.end();
  }
  else {
    Serial.println("Wifi Disconnected");
  }
}
