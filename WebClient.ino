#include <Ethernet.h>
#define trigPin 2
#define echoPin 3
#define enableNotification 4

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};

char server[] =
    "gate-tracker.herokuapp.com"; // name address for gate-keeper (using DNS)
// Initialize the Ethernet client library
// with the port of the server
// that you want to connect to (port 80 is default for HTTP):
EthernetClient client;

void setup() {

    // Open serial communications and wait for port to open:
    Serial.begin(9600);
    while (!Serial) {
        ; // wait for serial port to connect. Needed for native USB port only
    }
    pinMode(trigPin, OUTPUT);

    pinMode(echoPin, INPUT);

    pinMode(enableNotification, INPUT);

    // start the Ethernet connection:
    Serial.println("Initialize Ethernet with DHCP:");
    if (Ethernet.begin(mac) == 0) {
        Serial.println("Failed to configure Ethernet using DHCP");
        // Check for Ethernet hardware present
        if (Ethernet.hardwareStatus() == EthernetNoHardware) {
            Serial.println("Ethernet shield was not found.  Sorry, can't run "
                           "without hardware. :(");
            while (true) {
                delay(1); // do nothing, no point running without Ethernet
                          // hardware
            }
        }
        if (Ethernet.linkStatus() == LinkOFF) {
            Serial.println("Ethernet cable is not connected.");
            while (true) {
                delay(1); // do nothing, no point running without Ethernet
                          // connection
            }
        }

    } else {
        Serial.print("  DHCP assigned IP ");
        Serial.println(Ethernet.localIP());
    }
    // give the Ethernet shield a second to initialize:
    delay(1000);
    Serial.print("connecting to ");
    Serial.print(server);
    Serial.println("...");

    // if you get a connection, report back via serial:
}

void loop() {

    // if there are incoming bytes available
    // from the server, read them and print them:

    bool stat = true;
    long duration, distance;
    while (
        digitalRead(enableNotification) ==
        HIGH) { // Via switch we can control if the notifications will be sent

        digitalWrite(trigPin, LOW); // This block of code is used to measure the
                                    // distance for ultrasonic sensor
        delayMicroseconds(2);
        digitalWrite(trigPin, HIGH);
        delayMicroseconds(10);
        digitalWrite(trigPin, LOW);
        duration = pulseIn(echoPin, HIGH);
        distance = (duration / 2) / 29;

        if ((distance >= 10 || distance <= 0) && stat == true) {

            Serial.print("Gate open (false)");
            Serial.println();
            if (client.connect(server, 80)) {
                // Make a HTTP request:
                client.println("POST /api HTTP/1.1");
                client.println("Host: gate-tracker.herokuapp.com");
                client.println("User-Agent: Arduino/1.0");
                client.println("Connection: close");
                client.println("Content-Type: application/json");
                client.println("Content-Length: 17");
                client.println(); // this is mandatory
                client.println("{\"state\":\"false\"}");
                Serial.println("Info send");
                stat = false;
            } else {
                // if you didn't get a connection to the server:
                Serial.println("connection failed");
            }

        } else if (distance < 10 && stat == false) {
            Serial.println("Gate closed (true)");
            if (client.connect(server, 80)) {
                // Make a HTTP request:
                client.println("POST /api HTTP/1.1");
                client.println("Host: gate-tracker.herokuapp.com");
                client.println("User-Agent: Arduino/1.0");
                client.println("Connection: close");
                client.println("Content-Type: application/json");
                client.println("Content-Length: 16");
                client.println(); // this is mandatory
                client.println("{\"state\":\"true\"}");
                Serial.println("Info send");
                stat = true;
            } else {
                // if you didn't get a connection to the server:
                Serial.println("connection failed");
            }
        }
        delay(500);
    }
}