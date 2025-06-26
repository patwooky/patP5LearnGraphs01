
// Define the custom ramp with 5 sampled values
let customRamp = [0, 0.15, 0.35, 0.55, 1];

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  // Example: Look up a value from the ramp
  let normalizedInput = map(mouseX, 0, width, 0, 1); // Normalize mouseX to 0-1
  let rampValue = getRampValue(normalizedInput); // Get interpolated value from the ramp

  // Display the ramp value
  textSize(16);
  fill(0);
  text(`Ramp Value: ${rampValue.toFixed(2)}`, 10, 20);

  // Visualize the ramp value
  fill(255, 0, 0);
  ellipse(width / 2, height / 2, rampValue * 200, rampValue * 200);
}

// Function to interpolate between ramp values
function getRampValue(input) {
  let index = floor(input * (customRamp.length - 1)); // Get the base index
  let nextIndex = min(index + 1, customRamp.length - 1); // Ensure next index is within bounds
  let t = (input * (customRamp.length - 1)) % 1; // Fractional part for interpolation

  // Linear interpolation between the two sampled values
  return lerp(customRamp[index], customRamp[nextIndex], t);
}