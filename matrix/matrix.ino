#include "Arduino_LED_Matrix.h"

ArduinoLEDMatrix matrix;

// Frame 1: Road lines at initial position
byte frame1[8][12] = {
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 1
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 2
  { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },  // Row 3
  { 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 },  // Row 4
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 5
  { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },  // Row 0 (top)
  { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
  { 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 }  // Row 6 - road lines
};

// Frame 2: Road lines shifted left
byte frame2[8][12] = {
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 1
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 2
  { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },  // Row 3
  { 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 },  // Row 4
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 5
  { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },  // Row 0 (top)
  { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
  { 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0 }   // Road lines shifted left one position
};

// Frame 3: Road lines shifted left more
byte frame3[8][12] = {
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 1
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 2
  { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },  // Row 3
  { 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },  // Row 4
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 5
  { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },  // Row 0 (top)
  { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
  { 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 }
};

// Frame 1: Road lines at initial position
byte frame4[8][12] = {
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 1
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 2
  { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },  // Row 3
  { 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 },  // Row 4
  { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 },  // Row 5
  { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },  // Row 0 (top)
  { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
  { 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1 }  // Row 7 (bottom)
};

void setup() {
  Serial.begin(115200);
  matrix.begin();
}

void loop() {
  // Display each frame with a short delay
  matrix.renderBitmap(frame1, 8, 12);
  delay(150);
  
  matrix.renderBitmap(frame2, 8, 12);
  delay(150);
  
  matrix.renderBitmap(frame3, 8, 12);
  delay(150);
  
  matrix.renderBitmap(frame4, 8, 12);
  delay(150);
}