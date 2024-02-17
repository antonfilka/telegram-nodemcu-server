#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Anton";
const char* password = "antonfilka080520";
const char* mqtt_server = "192.168.31.156";
const int mqttPort = 1883; 

WiFiClient espClient;
PubSubClient client(espClient);


void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");

  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
  }
  Serial.println();

  // Check if the message is on the "wake" topic
  if (String(topic) == "wake") {
    // Blink the LED 5 times
    Serial.print("Blink the LED 5 times");

    for (int i = 0; i < 5; i++) {
      digitalWrite(LED_BUILTIN, LOW); // Turn the LED on (Note: LOW is on for most NodeMCU boards)
      delay(500); // Wait for 500 milliseconds
      digitalWrite(LED_BUILTIN, HIGH); // Turn the LED off
      delay(500); // Wait for 500 milliseconds
    }
  }
}

void reconnect() {
 while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("NodeMCUClient")) {
      Serial.println("connected");
      client.subscribe("client/welcome");
      client.subscribe("wake");
      Serial.println("");
      Serial.println("Subscribed to client/welcome");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}


void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  setup_wifi(); 
  client.setServer(mqtt_server, mqttPort);
  client.setCallback(callback); 
  // Attempt to connect to the MQTT broker and subscribe to topics in the loop() function
}

void loop() {
  if (!client.connected()) {
    reconnect(); // Implement this function to manage MQTT reconnections
  }
  client.loop();
}
