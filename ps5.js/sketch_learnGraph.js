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

// declaring global variables for Stream A and Stream B label heights
// store last 5 frames of ech label height
let streamALabelHeights = []; // Array to store heights of Stream A labels
let streamBLabelHeights = []; // Array to store heights of Stream B labels
let streamLabelHeightsMax = 15; // Max number of heights to store for each stream

function draw() {
  background(220);
  let thisFrame = frameCount * 0.013;
  let sineWaveHeight = 50;
  let nseSeed = 1234; // Seed for random number generation
  let rampShift = frameCount * 0.0011; // background noise points shift speed

  // Draw axes for Stream A (top graph)
  let streamAStartY = 40;
  let streamAEndY = streamAStartY + canvasHeight * 0.4;
  let streamAHeight = streamAEndY - streamAStartY;
  let streamAWidth = canvasWidth * 0.8;
  let streamAStartWidth = 50;
  stroke(0);
  line(streamAStartWidth, streamAEndY, streamAWidth, streamAEndY); // X-axis
  line(streamAStartWidth, streamAStartY, streamAStartWidth, streamAEndY); // Y-axis
  noStroke();
  fill(200, 0, 0, 255); 
  text("Stream A", 50, streamAStartY - 10);
  fill (0, 0, 0, 0); // reset fill color for next drawing

  // Plot points for Stream A
  // stroke(255, 0, 0, 0);
  let numStrokePts = 500;
  let strokeInterval = streamAWidth / float(numStrokePts) * 0.5;
  for (let i = 0; i < streamAWidth; i++) {
    // make normalisedX wrap around 0-1
    let normalisedX = abs(i / streamAWidth + rampShift) % 1.0; // Normalize x position
    // Set stroke color based on normalized x position
    stroke(255, 0, 0, map(getRampValue(normalisedX),0,1,0.15,1)*255*0.3); 
    ellipse(
      streamAStartWidth + strokeInterval * i,
      streamAStartY + noise((thisFrame*0.15 + i*1) * 1.1 + nseSeed) * streamAHeight,
      5, 5
    );
  }

  noiseSeed(nseSeed); // Set seed for noise function
  // Draw sine wave for Stream A
  stroke(255, 0, 0, 255); // Red for Stream A
  noFill();
  let avgYStreamA; // average Y position for Stream A label
  beginShape();
  for (let x = 0; x < streamAWidth; x++) {
    let y = streamAStartY + (streamAHeight * 0.5) +
      sin(thisFrame + x * 0.02) * sineWaveHeight;
    let nse = noise(thisFrame*10 + x * 0.13) * 50; // Add noise to y position
    let yVal = y + nse; // Calculate the final y position with noise
    vertex(streamAStartWidth + x, yVal); // plot the vertex
    if (x === streamAWidth - 1) {
      lastYStreamA = yVal; // Store the last Y position
    }
    // append to global array for Stream B label heights
    streamALabelHeights.push(yVal);
    // Keep only the last 5 heights
    if (streamALabelHeights.length > streamLabelHeightsMax) {
      streamALabelHeights.shift(); // Remove the oldest height
    }
    // lerp the last 5 heights to get a stable label position
    avgYStreamA = streamALabelHeights.reduce((a, b) => a + b, 0) / streamALabelHeights.length;
    vertex(streamAStartWidth + x, yVal); // plot the vertex
  }
  endShape();
  // Add label for Stream A
  fill(255, 0, 0, 255); // Red color for the label
  noStroke();
  text("Stream A Curve", streamAStartWidth + streamAWidth + 10, avgYStreamA);
  fill (0, 0, 0, 0); // reset fill color for next drawing

  // Draw axes for Stream B (bottom graph)
  let streamBStartY = canvasHeight * 0.55 - 20;
  let streamBEndY = streamBStartY + canvasHeight * 0.4;
  let streamBHeight = streamBEndY - streamBStartY;
  let streamBWidth = canvasWidth * 0.8;
  let streamBStartWidth = 50;
  stroke(0);
  line(streamBStartWidth, streamBEndY, streamBWidth, streamBEndY); // X-axis
  line(streamBStartWidth, streamBStartY, streamBStartWidth, streamBEndY); // Y-axis
  noStroke();
  fill(0, 0, 200, 255); 
  text("Stream B", 50, streamBStartY - 10);
  fill(0, 0, 0, 0); // reset fill color for next drawing

  // Plot points for Stream B
  stroke(0, 0, 255, 255);
  for (let i = 0; i < streamBWidth; i++) {
    // make normalisedX wrap around 0-1
    let normalisedX = abs(i / streamAWidth - rampShift) % 1.0; // Normalize x position
    // Set stroke color based on normalized x position
    stroke(0, 0, 255, map(getRampValue(normalisedX),0,1,0.15,1)*255*0.3); 
    ellipse(
      streamBStartWidth + strokeInterval * i,
      streamBStartY + noise(((311+thisFrame)*0.15 + i*1) * 1.1 + nseSeed) * streamBHeight,
      5, 5
    );
  }

  noiseSeed(nseSeed+88.834); // Set seed for noise function
  let curveXOffset = 12 * noise(nseSeed+88.834); // Offset for curve X position
  // Draw sine wave for Stream B
  stroke(0, 0, 255, 255); // Blue for Stream B
  noFill();
  
  let avgYStreamB; // average Y position for Stream B label
  beginShape();
  for (let x = 0; x < streamBWidth; x++) {
    let y = streamBStartY + (streamBHeight * 0.5) +
      sin(-thisFrame - curveXOffset + x * 0.02) * sineWaveHeight;
    let nse = noise(thisFrame*10 + x * 0.13) * 50; // Add noise to y position
    let yVal = y + nse; // Calculate the final y position with noise
    if (x === streamBWidth - 1) {
      lastYStreamB = yVal; // Store the last Y position
    }
    // append to global array for Stream B label heights
    streamBLabelHeights.push(yVal);
    // Keep only the last 5 heights
    if (streamBLabelHeights.length > streamLabelHeightsMax) {
      streamBLabelHeights.shift(); // Remove the oldest height
    }
    // lerp the last 5 heights to get a stable label position
    avgYStreamB = streamBLabelHeights.reduce((a, b) => a + b, 0) / streamBLabelHeights.length;
    vertex(streamBStartWidth + x, yVal); // plot the vertex
  }
  endShape();
  // Add label for Stream B
  fill(0, 0, 255, 255); // Red color for the label
  noStroke();
  text("Stream B Curve", streamBStartWidth + streamBWidth + 10, avgYStreamB);
  fill (0, 0, 0, 0); // reset fill color for next drawing
}
