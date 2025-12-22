#include <Arduino.h>
#include <vector>
#include <ArduinoJson.h>
#include "painlessMesh.h"

// ------------------------- SIM CONFIG -------------------------------
#define TINY_GSM_MODEM_SIM800
#define TINY_GSM_RX_BUFFER 1024

#include <TinyGsmClient.h>
#include <Wire.h>

// APN
const char apn[] = "airtelgprs.com";
const char gprsUser[] = "";
const char gprsPass[] = "";
const char simPIN[] = "";

// Server
const char server[] = "postman-echo.com";
const char resource[] = "/post";
const int port = 80;

// ------------------------- TTGO T-CALL PINS --------------------------
#define MODEM_RST 5
#define MODEM_PWKEY 4
#define MODEM_POWER_ON 23
#define MODEM_TX 27
#define MODEM_RX 26
#define I2C_SDA 21
#define I2C_SCL 22

#define SerialMon Serial
#define SerialAT Serial1

TwoWire I2CPower = TwoWire(0);
TinyGsm modem(SerialAT);
TinyGsmClient client(modem);

// ------------------------- IP5306 -----------------------------------
#define IP5306_ADDR 0x75
#define IP5306_REG_SYS_CTL0 0x00

bool setPowerBoostKeepOn(int en) {
  I2CPower.beginTransmission(IP5306_ADDR);
  I2CPower.write(IP5306_REG_SYS_CTL0);
  I2CPower.write(en ? 0x37 : 0x35);
  return I2CPower.endTransmission() == 0;
}

// ------------------------- MESH CONFIG -------------------------------
#define MESH_PREFIX "EspMeshNetwork"
#define MESH_PASSWORD "somethingSneaky"
#define MESH_PORT 5555

Scheduler userScheduler;
painlessMesh mesh;

// ------------------------- DATA QUEUE --------------------------------
std::vector<String> pendingQueue;

// ------------------------- MESH CALLBACKS ----------------------------
void receivedCallback(uint32_t from, String &msg) {
  Serial.printf("Received from %u: %s\n", from, msg.c_str());
  pendingQueue.push_back(msg);
}

void newConnectionCallback(uint32_t nodeId) {
  Serial.printf("New node: %u\n", nodeId);
}

void changedConnectionCallback() {
  Serial.println("Mesh connections changed");
}

void nodeTimeAdjustedCallback(int32_t offset) {
  Serial.printf("Time adjusted. Offset=%d\n", offset);
}

// ------------------------- HTTP POST ---------------------------------
void postToServer(const String &payload) {

  if (!modem.isGprsConnected()) {
    SerialMon.println("GPRS not connected");
    return;
  }

  if (!client.connect(server, port)) {
    SerialMon.println("TCP connect failed");
    return;
  }

  client.print(String("POST ") + resource + " HTTP/1.1\r\n");
  client.print(String("Host: ") + server + "\r\n");
  client.println("Connection: close");
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.println(payload.length());
  client.println();
  client.println(payload);

  unsigned long timeout = millis();
  while (client.connected() && millis() - timeout < 10000) {
    while (client.available()) {
      SerialMon.write(client.read());
      timeout = millis();
    }
  }

  client.stop();
  SerialMon.println("\nPOST done");
}

// --------------------------- SETUP -----------------------------------
void setup() {
  Serial.begin(115200);
  delay(3000);

  I2CPower.begin(I2C_SDA, I2C_SCL, 400000);
  setPowerBoostKeepOn(1);

  pinMode(MODEM_PWKEY, OUTPUT);
  pinMode(MODEM_RST, OUTPUT);
  pinMode(MODEM_POWER_ON, OUTPUT);
  digitalWrite(MODEM_POWER_ON, HIGH);
  digitalWrite(MODEM_RST, HIGH);
  digitalWrite(MODEM_PWKEY, LOW);

  SerialAT.begin(115200, SERIAL_8N1, MODEM_RX, MODEM_TX);
  delay(3000);

  SerialMon.println("Restarting modem...");
  modem.restart();

  if (strlen(simPIN) && modem.getSimStatus() != 3) {
    modem.simUnlock(simPIN);
  }

  SerialMon.print("Connecting GPRS...");
  if (!modem.gprsConnect(apn, gprsUser, gprsPass)) {
    SerialMon.println(" FAIL");
  } else {
    SerialMon.println(" OK");
  }

  mesh.setDebugMsgTypes(ERROR | STARTUP);
  mesh.init(MESH_PREFIX, MESH_PASSWORD, &userScheduler, MESH_PORT);
  mesh.onReceive(&receivedCallback);
  mesh.onNewConnection(&newConnectionCallback);
  mesh.onChangedConnections(&changedConnectionCallback);
  mesh.onNodeTimeAdjusted(&nodeTimeAdjustedCallback);
}

// ----------------------------- LOOP ----------------------------------
void loop() {
  mesh.update();

  if (!pendingQueue.empty()) {
    String data = pendingQueue.front();
    pendingQueue.erase(pendingQueue.begin());

    String payload = "{\"scanner_id\":\"abcxut234\",\"data\":" + data + "}";
    postToServer(payload);
  }

  if (!modem.isGprsConnected()) {
    SerialMon.println("Reconnecting GPRS...");
    modem.gprsConnect(apn, gprsUser, gprsPass);
  }
}
