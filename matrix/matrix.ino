#include "Arduino_LED_Matrix.h"
ArduinoLEDMatrix matrix;

// Array of all animation patterns, corrected type
const uint32_t (*const animations[])[4] = {
  LEDMATRIX_ANIMATION_STARTUP,
  LEDMATRIX_ANIMATION_TETRIS_INTRO,
  LEDMATRIX_ANIMATION_ATMEGA,
  LEDMATRIX_ANIMATION_LED_BLINK_HORIZONTAL,
  LEDMATRIX_ANIMATION_LED_BLINK_VERTICAL,
  LEDMATRIX_ANIMATION_ARROWS_COMPASS,
  LEDMATRIX_ANIMATION_AUDIO_WAVEFORM,
  LEDMATRIX_ANIMATION_BATTERY,
  LEDMATRIX_ANIMATION_BOUNCING_BALL,
  LEDMATRIX_ANIMATION_BUG,
  LEDMATRIX_ANIMATION_CHECK,
  LEDMATRIX_ANIMATION_CLOUD,
  LEDMATRIX_ANIMATION_DOWNLOAD,
  LEDMATRIX_ANIMATION_DVD,
  LEDMATRIX_ANIMATION_HEARTBEAT_LINE,
  LEDMATRIX_ANIMATION_HEARTBEAT,
  LEDMATRIX_ANIMATION_INFINITY_LOOP_LOADER,
  LEDMATRIX_ANIMATION_LOAD_CLOCK,
  LEDMATRIX_ANIMATION_LOAD,
  LEDMATRIX_ANIMATION_LOCK,
  LEDMATRIX_ANIMATION_NOTIFICATION,
  LEDMATRIX_ANIMATION_OPENSOURCE,
  LEDMATRIX_ANIMATION_SPINNING_COIN,
  LEDMATRIX_ANIMATION_TETRIS,
  LEDMATRIX_ANIMATION_WIFI_SEARCH
};

const int numAnimations = sizeof(animations) / sizeof(animations[0]);
int currentAnimation = 0;
int playCount = 0;

void setup() {
  Serial.begin(115200);
  matrix.begin();
  
  // Start with the first animation
  loadNextAnimation();
}

void loop() {
  // Check if current animation sequence is done
  if (matrix.sequenceDone()) {
    playCount++;
    
    // If we've played this animation 4 times
    if (playCount >= 4) {
      playCount = 0;
      currentAnimation = (currentAnimation + 1) % numAnimations;
      loadNextAnimation();
    } else {
      // Play the same animation again
      matrix.play(false);
    }
  }
}

void loadNextAnimation() {
  matrix.loadSequence(animations[currentAnimation]);
  matrix.play(false);  // Play once, not looping
}