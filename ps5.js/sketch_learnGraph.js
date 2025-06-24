// This is a p5.js sketch that sets up a canvas and draws two graphs.

let canvasWidth = 1200;
let canvasHeight = 800;
function setup() {
  createCanvas(canvasWidth, 800);
}

// define a custom ramp with 5 sampled values
let customRamp = [0, 0.15, 0.55, 1, 1, 1, 0.55, 0.15, 0];

// Function to interpolate between ramp values
function getRampValue(input) {
  let index = floor(input * (customRamp.length - 1)); // Get the base index
  let nextIndex = min(index + 1, customRamp.length - 1); // Ensure next index is within bounds
  let t = (input * (customRamp.length - 1)) % 1; // Fractional part for interpolation

  // Linear interpolation between the two sampled values
  return lerp(customRamp[index], customRamp[nextIndex], t);
}

function draw() {
  background(220);
  let thisFrame = frameCount * 0.013;
  let sineWaveHeight = 50;
  let nseSeed = 1234; // Seed for random number generation

  // Draw axes for Stream A (top graph)
  let streamAStartY = 40;
  let streamAEndY = streamAStartY + canvasHeight * 0.4;
  let streamAHeight = streamAEndY - streamAStartY;
  let streamAWidth = canvasWidth * 0.8;
  let streamAStartWidth = 50;
  stroke(0);
  line(streamAStartWidth, streamAEndY, streamAWidth, streamAEndY); // X-axis
  line(streamAStartWidth, streamAStartY, streamAStartWidth, streamAEndY); // Y-axis
  text("Stream A", 50, streamAStartY - 10);

  // Plot points for Stream A
  stroke(255, 0, 0);
  let numStrokePts = 500;
  let strokeInterval = streamAWidth / float(numStrokePts) * 0.5;
  for (let i = 0; i < streamAWidth; i++) {
    let normalisedX = i / streamAWidth; // Normalize x position
    stroke(255, 0, 0, getRampValue(normalisedX)*255*0.3); // Set stroke color based on normalized x position
    ellipse(
      streamAStartWidth + strokeInterval * i,
      streamAStartY + noise(thisFrame + i * sin(321+i+thisFrame*0.1) * 0.05 + nseSeed) * streamAHeight,
      5, 5
    );
  }

  noiseSeed(nseSeed); // Set seed for noise function
  // Draw sine wave for Stream A
  stroke(255, 0, 0); // Red for Stream A
  noFill();
  beginShape();
  for (let x = 0; x < streamAWidth; x++) {
    let y = streamAStartY + (streamAHeight * 0.5) +
      sin(thisFrame + x * 0.02) * sineWaveHeight;
    let nse = noise(thisFrame*10 + x * 0.13) * 50; // Add noise to y position
    vertex(streamAStartWidth + x, y + nse); // plot the vertex
  }
  endShape();

  // Draw axes for Stream B (bottom graph)
  let streamBStartY = canvasHeight * 0.55 - 20;
  let streamBEndY = streamBStartY + canvasHeight * 0.4;
  let streamBHeight = streamBEndY - streamBStartY;
  let streamBWidth = canvasWidth * 0.8;
  let streamBStartWidth = 50;
  stroke(0);
  line(streamBStartWidth, streamBEndY, streamBWidth, streamBEndY); // X-axis
  line(streamBStartWidth, streamBStartY, streamBStartWidth, streamBEndY); // Y-axis
  text("Stream B", 50, streamBStartY - 10);

  // Plot points for Stream B
  stroke(0, 0, 255);
  for (let i = 0; i < streamBWidth; i++) {
    let normalisedX = i / streamBWidth; // Normalize x position
    stroke(0, 0, 255, getRampValue(normalisedX)*255*0.3); // Set stroke color based on normalized x position
    ellipse(
      streamBStartWidth + strokeInterval * i,
      streamBStartY + noise(thisFrame + i * sin(321+i+thisFrame*0.1) * 0.05 + nseSeed) * streamBHeight,
      5, 5
    );
  }

  noiseSeed(nseSeed+88.834); // Set seed for noise function
  let curveXOffset = 12 * noise(nseSeed+88.834); // Offset for curve X position
  // Draw sine wave for Stream B
  stroke(0, 0, 255); // Blue for Stream B
  noFill();
  beginShape();
  for (let x = 0; x < streamBWidth; x++) {
    let y = streamBStartY + (streamBHeight * 0.5) +
      sin(thisFrame + curveXOffset + x * 0.02) * sineWaveHeight;
    let nse = noise(thisFrame*10 + x * 0.13) * 50; // Add noise to y position
    vertex(streamBStartWidth + x, y + nse); // plot the vertex
  }
  endShape();
}
