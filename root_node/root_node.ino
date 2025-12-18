#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
  #include <HTTPClient.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
  #include <ESP8266HTTPClient.h>
#endif
#include <time.h>
#include <ArduinoJson.h>
#include <vector>
#include "painlessMesh.h"

#define MESH_PREFIX "EspMeshNetwork"
#define MESH_PASSWORD "somethingSneaky"
#define MESH_PORT 5555

Scheduler userScheduler; // to control your personal task
painlessMesh  mesh;

// ------------------------- WIFI CONFIG -------------------------------
// const char* ssid = "Airtel_vsvai";
// const char* password = "lenovoturbo";
const char* ssid = "DESKTOP-002BNFK 2693";
const char* password = "123456789";

// FastAPI URL
const char* serverName = "http://192.168.1.12:8000/api/record-data";

//const char* serverName = "http://glpjr3lm-5173.inc1.devtunnels.ms/api/record-data";


// ------------------------- DEVICE QUEUE ------------------------------
struct BeaconData {
  String mac;
  int rssi;
  String name;
  String timestamp;
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
  // configTime(19800, 0, "time.google.com");
  // struct tm timeinfo;
  // while (!getLocalTime(&timeinfo)) {
  //   Serial.println("Waiting for NTP...");
  //   delay(500);
  // }
  // Serial.println("Time Synced!");

  //mesh.setDebugMsgTypes( ERROR | MESH_STATUS | CONNECTION | SYNC | COMMUNICATION | GENERAL | MSG_TYPES | REMOTE ); // all types on
  mesh.setDebugMsgTypes(ERROR | STARTUP);  // set before init() so that you can see startup messages

  mesh.init(MESH_PREFIX, MESH_PASSWORD, &userScheduler, MESH_PORT);
  mesh.onReceive(&receivedCallback);
  mesh.onNewConnection(&newConnectionCallback);
  mesh.onChangedConnections(&changedConnectionCallback);
  mesh.onNodeTimeAdjusted(&nodeTimeAdjustedCallback);
}

// ----------------------------- LOOP ----------------------------------
void loop() {
  // it will run the user scheduler as well
  mesh.update();
  Serial.println("\nWaiting 2 seconds before next scan...\n");
  delay(2000);
}

// Needed for painless library
void receivedCallback(uint32_t from, String& msg) {
  Serial.printf("->Received from %u msg=%s\n", from, msg.c_str());
  postToServer(msg);
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

// CUSTOM FUNCTIONS
void postToServer(String data) {

    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");

    // StaticJsonDocument<200> doc;
    // DeserializationError err = deserializeJson(doc, data);
    // Serial.print(doc["beacon_id"]);
    // Serial.print(doc["rssi"]);
    // doc["beacon_id"] = d.mac;
    // doc["rssi"] = d.rssi;
//    doc["name"] = d.name;
//    doc["time"] = d.timestamp;

    // String json;
    // serializeJson(doc, json);

    int code = http.POST(data);

    Serial.print("POST -> ");
    Serial.print(data);
    Serial.print(" | Response: ");
    Serial.println(code);

    http.end();
}