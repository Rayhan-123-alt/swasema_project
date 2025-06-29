#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <time.h>
#include <ArduinoJson.h>



// WiFi credentials
const char* ssid = "Hidroponik-Kel5";
const char* password = "theworldiscrying";

// MQTT Broker
const char* mqttServer = "192.168.37.23"; // Ganti dengan IP broker MQTT kamu
const int mqttPort = 1883;
const char* mqttUser = "";  // Jika tidak ada, biarkan kosong
const char* mqttPassword = "";

WiFiClient espClient;
PubSubClient client(espClient);

//PH Calibrator
float ph_calibration_value = 20 + 1.5;
unsigned long int ph_avgval;
int ph_buffer_arr[10], ph_temp;
float ph_act;

// DHT11 Setup
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// DS18B20 Setup
#define ONE_WIRE_BUS 5
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// Analog pin
#define TDS_PIN 34
#define PH_SENSOR_PIN 35

// Relay
#define RELAY_A 22
#define RELAY_B 23

// NTP Client
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 25200); // GMT+7

unsigned long lastSend = 0;
const unsigned long interval = 30000; // 30 detik
float tdsOffset = -1999.39;

void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Menghubungkan ke WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi Terhubung.");
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Menghubungkan ke MQTT...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
      Serial.println("terhubung.");
      client.subscribe("swasema/pump");
    } else {
      Serial.print("gagal, rc=");
      Serial.print(client.state());
      Serial.println(" coba lagi dalam 5 detik...");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("🔔 MQTT Command: ");
  Serial.println(message);

  StaticJsonDocument<200> doc;
  DeserializationError err = deserializeJson(doc, message);

  if (err) {
    Serial.println("⚠️ Failed to parse MQTT command");
    return;
  }

  String id = doc["id"];
  String status = doc["status"];

  int pin = -1;
  if (id == "A") pin = 22;
  else if (id == "B") pin = 23;

  if (pin != -1) {
    digitalWrite(pin, status == "on" ? HIGH : LOW);
    Serial.printf("Pompa %s %s\n", id.c_str(), status.c_str());
  }
}


void setup() {
  Serial.begin(115200);
  dht.begin();
  sensors.begin();
  pinMode(RELAY_A, OUTPUT);
  pinMode(RELAY_B, OUTPUT);
  digitalWrite(RELAY_A, LOW);
  digitalWrite(RELAY_B, LOW);

  connectWiFi();
  client.setCallback(callback);
  client.setServer(mqttServer, mqttPort);
  timeClient.begin();
}

float ReadPH() {
  // Baca data analog
  for (int i = 0; i < 10; i++) {
    ph_buffer_arr[i] = analogRead(PH_SENSOR_PIN);
    delay(30);
  }

  // Urutkan data (bubble sort)
  for (int i = 0; i < 9; i++) {
    for (int j = i + 1; j < 10; j++) {
      if (ph_buffer_arr[i] > ph_buffer_arr[j]) {
        ph_temp = ph_buffer_arr[i];
        ph_buffer_arr[i] = ph_buffer_arr[j];
        ph_buffer_arr[j] = ph_temp;
      }
    }
  }

  // Ambil rata-rata dari data tengah
  ph_avgval = 0;
  for (int i = 2; i < 8; i++)
    ph_avgval += ph_buffer_arr[i];

  // Konversi ke voltase ESP32
  float volt = (float)ph_avgval * 3.3 / 4095.0 / 6;
  ph_act = -5.70 * volt + ph_calibration_value;
  return ph_act;
}

void loop() {
  float voltage = analogRead(TDS_PIN) * (3.3 / 4096.0); 
  float tds = (133.42 * pow(voltage, 3) - 255.86 * pow(voltage, 2) + 857.39 * voltage) * 0.5;
  float tdsCalibrated = tds * 0.92;
  if (!client.connected()) reconnectMQTT();
  client.loop();

  if ((millis() - lastSend) > interval) {
    lastSend = millis();
    timeClient.update();

    sensors.requestTemperatures();
    float suhuUdara = dht.readTemperature();
    float kelembapan = dht.readHumidity();
    float suhuAir = sensors.getTempCByIndex(0);
    float tds = tdsCalibrated;
    float ph = ReadPH();

    char payload[256];
    snprintf(payload, sizeof(payload),
      "{\"suhuUdara\":%.2f,\"kelembapan\":%.2f,\"suhuAir\":%.2f,\"tds\":%.2f,\"ph\":%.2f}",
      suhuUdara, kelembapan, suhuAir, tds, ph);

    Serial.println("Mengirim via MQTT:");
    Serial.println(payload);

    client.publish("esp32/sensor", payload); // Ganti topic sesuai kebutuhan
  }
}
