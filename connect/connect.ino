#include <ArduinoBLE.h>
#include "ArduinoGraphics.h"
#include "Arduino_LED_Matrix.h"

BLEService newService("0000180F-0000-1000-8000-00805F9B34FB");  // Battery Service
BLEByteCharacteristic switchChar("00002A1B-0000-1000-8000-00805F9B34FB", BLERead | BLEWrite); // Battery State

ArduinoLEDMatrix matrix;

const int ledPin = 2;
long previousMillis = 0;
const char* deviceName = "UnoR4-01";
bool isAnimating = false;

void sayYoureTheGreatest() {
  matrix.beginDraw();
  matrix.stroke(0xFFFFFFFF);
  matrix.textScrollSpeed(50);
  
  const char text[] = "    Love you!    ";
  matrix.textFont(Font_5x7);
  matrix.beginText(0, 1, 0xFFFFFF);
  matrix.println(text);
  matrix.endText(SCROLL_LEFT);
  
  matrix.endDraw();
}

void sayHiBrianna() {
  matrix.beginDraw();
  matrix.stroke(0xFFFFFFFF);
  matrix.textScrollSpeed(50);
  
  const char text[] = "    Hi, Brianna!    ";
  matrix.textFont(Font_5x7);
  matrix.beginText(0, 1, 0xFFFFFF);
  matrix.println(text);
  matrix.endText(SCROLL_LEFT);
  
  matrix.endDraw();
}

void setup() {
  Serial.begin(9600);    
  while (!Serial);       

  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(ledPin, OUTPUT);
  
  matrix.begin();  // Initialize matrix once at startup

  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy failed!");
    while (1);
  }

  BLE.setLocalName(deviceName);
  BLE.setAdvertisedService(newService);
  
  newService.addCharacteristic(switchChar);
  BLE.addService(newService);

  switchChar.writeValue(0);

  BLE.setAdvertisingInterval(100);
  BLE.advertise();
  
  Serial.print("Bluetooth® device '");
  Serial.print(deviceName);
  Serial.println("' active, waiting for connections...");
}

void loop() {
  BLEDevice central = BLE.central();

  if (central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());
    
    sayHiBrianna();

    while (central.connected()) {
      long currentMillis = millis();
      
      if (currentMillis - previousMillis >= 200) {
        previousMillis = currentMillis;

        if (switchChar.written()) {
          if (switchChar.value()) {
            Serial.println("Animation start");
            isAnimating = true;
            matrix.loadSequence(LEDMATRIX_ANIMATION_HEARTBEAT);
            matrix.play(true);
          } else {
            Serial.println("Animation stop");
            isAnimating = false;
            matrix.clear();  // Clear the current animation
            sayYoureTheGreatest();
          }
        }
        
        // Keep animation running if active
        if (isAnimating) {
          matrix.play(true);
        }
      }
    }
    
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
    
    // Clean up on disconnect
    matrix.clear();
    isAnimating = false;
  }
}