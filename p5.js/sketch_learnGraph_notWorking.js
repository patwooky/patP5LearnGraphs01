// This is a p5.js sketch that sets up a canvas and draws two graphs.

// Global variables for canvas dimensions
let canvasWidth = 1200;
let canvasHeight = 800;
let graphsWidth = canvasWidth * 0.8; ; // Width of the graphs area  (960px)
let streamCPointCount = graphsWidth; // Number of points in Stream C curve
let streamCVals = []; // Array to store Stream C curve values

// declaring global variables for Stream A and Stream B label heights
// store last 5 frames of each label height
let streamLabelHeightsMax = 15; // Max number of heights to store for each stream
let streamALabelHeights = []; // Array to store heights of Stream A labels
let streamBLabelHeights = []; // Array to store heights of Stream B labels
let streamCLabelHeights = []; // Array to store heights of Stream C labels

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
  let rampShift = frameCount * 0.0011; // background noise points shift speed
  let streamsStartWidth = 50;

  // Draw axes for Stream A (top graph)
  let streamAStartY = 40;
  let streamAEndY = streamAStartY + canvasHeight * 0.4;
  let streamAHeight = streamAEndY - streamAStartY;
  let streamAWidth = graphsWidth; // Width of Stream A graph
  stroke(0);
  line(streamsStartWidth, streamAEndY, streamAWidth, streamAEndY); // X-axis
  line(streamsStartWidth, streamAStartY, streamsStartWidth, streamAEndY); // Y-axis
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
      streamsStartWidth + strokeInterval * i,
      streamAStartY + noise((thisFrame*0.15 + i*1) * 1.1 + nseSeed) * streamAHeight,
      5, 5
    );
  }

  noiseSeed(nseSeed); // Set seed for noise function
  // Draw sine wave for Stream A
  stroke(255, 0, 0, 255); // Red for Stream A
  noFill();
  let avgYStreamA; // average Y position for Stream A label
  let streamALastY; // Variable to store the last Y position of Stream B
  beginShape();
  for (let x = 0; x < streamAWidth; x++) {
    let y = streamAStartY + (streamAHeight * 0.5) +
      sin(thisFrame + x * 0.02) * sineWaveHeight;
    let nse = noise(thisFrame*10 + x * 0.13) * 50; // Add noise to y position
    let yVal = y + nse; // Calculate the final y position with noise
    vertex(streamsStartWidth + x, yVal); // plot the vertex
    if (x === streamAWidth - 1) {
      streamALastY = yVal; // Store the last Y position
    }
    // append to global array for Stream B label heights
    streamALabelHeights.push(streamALastY);
    // Keep only the last 5 heights
    if (streamALabelHeights.length > streamLabelHeightsMax) {
      streamALabelHeights.shift(); // Remove the oldest height
    }
    // lerp the last 5 heights to get a stable label position
    avgYStreamA = streamALabelHeights.reduce((a, b) => a + b, 0) / streamALabelHeights.length;
    vertex(streamsStartWidth + x, streamALastY); // plot the vertex
  }
  endShape();
  // Add label for Stream A
  fill(255, 0, 0, 255); // Red color for the label
  noStroke();
  text("Stream A Curve", streamsStartWidth + streamAWidth + 10, avgYStreamA);
  fill (0, 0, 0, 0); // reset fill color for next drawing

  // Draw axes for Stream B (bottom graph)
  // let streamBStartY = canvasHeight * 0.55 - 20;
  let streamBStartY = streamAStartY;
  let streamBEndY = streamBStartY + canvasHeight * 0.4;
  let streamBHeight = streamBEndY - streamBStartY;
  let streamBWidth = graphsWidth; // Width of Stream B graph
  stroke(0);
  line(streamsStartWidth, streamBEndY, streamBWidth, streamBEndY); // X-axis
  line(streamsStartWidth, streamBStartY, streamsStartWidth, streamBEndY); // Y-axis
  noStroke();
  fill(0, 0, 200, 255); 
  text("Stream B", 50, streamBStartY - 10);
  fill(0, 0, 0, 0); // reset fill color for next drawing

  // Plot points for Stream B
  stroke(0, 0, 255, 255);
  // console.log("streamBWidth", streamBWidth);
  for (let i = 0; i < streamBWidth; i++) {
    // make normalisedX wrap around 0-1
    let normalisedX = abs(i / streamAWidth - rampShift) % 1.0; // Normalize x position
    // Set stroke color based on normalized x position
    stroke(0, 0, 255, map(getRampValue(normalisedX),0,1,0.15,1)*255*0.3); 
    ellipse(
      streamsStartWidth + strokeInterval * i,
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
  let streamBLastY; // Variable to store the last Y position of Stream B
  beginShape();
  for (let x = 0; x < streamBWidth; x++) {
    let y = streamBStartY + (streamBHeight * 0.5) +
      sin(-thisFrame - curveXOffset + x * 0.018) * sineWaveHeight;
    let nse = noise(thisFrame*10 + x * 0.13) * 50; // Add noise to y position
    let yVal = y + nse; // Calculate the final y position with noise
    if (x === streamBWidth - 1) {
      streamBLastY = yVal; // Store the last Y position
    }
    // append to global array for Stream B label heights
    streamBLabelHeights.push(streamBLastY);
    // Keep only the last 5 heights
    if (streamBLabelHeights.length > streamLabelHeightsMax) {
      streamBLabelHeights.shift(); // Remove the oldest height
    }
    // lerp the last 5 heights to get a stable label position
    avgYStreamB = streamBLabelHeights.reduce((a, b) => a + b, 0) / streamBLabelHeights.length;
    vertex(streamsStartWidth + x, yVal); // plot the vertex
  }
  endShape();
  // Add label for Stream B
  fill(0, 0, 255, 255); // Blue color for the label
  noStroke();
  text("Stream B Curve", streamsStartWidth + streamBWidth + 10, avgYStreamB);
  fill (0, 0, 0, 0); // reset fill color for next drawing

  // Stream C 
  let streamCStartY = canvasHeight * 0.55 - 20;
  let streamCEndY = streamCStartY + canvasHeight * 0.4;
  let streamCHeight = streamCEndY - streamCStartY;
  let streamCWidth = graphsWidth; // Width of Stream C graph;
  stroke(0);
  line(streamsStartWidth, streamCEndY, streamCWidth, streamCEndY); // X-axis
  line(streamsStartWidth, streamCStartY, streamsStartWidth, streamCEndY); // Y-axis
  noStroke();
  fill(0, 50, 0, 255);
  text("Stream C", 50, streamCStartY - 10);
  fill(0, 0, 0, 0); // reset fill color for next drawing
  // Plot points for Stream C
  stroke(0, 15, 0, 255);
  for (let i = 0; i < streamCWidth; i++) {
    // make normalisedX wrap around 0-1
    let normalisedX = abs(i / streamCWidth + rampShift) % 1.0; // Normalize x position
    // Set stroke color based on normalized x position
    stroke(0, 15, 0, map(getRampValue(normalisedX),0,1,0.15,1)*255*0.3); 
    ellipse(
      streamsStartWidth + strokeInterval * i,
      streamCStartY + noise((thisFrame*0.15 + i*1) * 1.1 + nseSeed) * streamCHeight,
      5, 5
    );
  }
  noiseSeed(nseSeed+88.834); // Set seed for noise function
  // Draw decision curve wave for Stream C
  stroke(0, 50, 0, 255); // Green for Stream C
  noFill();
  beginShape();
  let avgYStreamC; // average Y position for Stream C label
  // Variable to choose between Stream A and Stream B
  let streamChooser = sin(thisFrame) > 0 ? 1 : 0; 
  // get length of streamCVals array
  let currStreamCLen = max(1, streamCVals.length); // Ensure at least 1 length
  currStreamCLen = min(currStreamCLen, streamCPointCount); // Limit to streamCPointCount
  for (let x = 0; x < currStreamCLen; x++) {
    // if not last frame, use streamCVals[x]
    // let yVal = streamCVals[x] || 0; // Use existing value or 0 if not defined
    let curveVal = streamCVals[x] || null; // Use existing value of StreamCVals
    let lastStreamCArrFlag = 0; // Flag to indicate last point in StreamCVals[]
    // let nse = noise(thisFrame*10 + x * 0.13) * 50; // Add noise to y position
    let y;
    let yVal; // Variable to store the final y position
    if (curveVal === null) {
      // If curveVal is null, it means we are at the last point of Stream C
      // Use last Y position of Stream A or B
      curveVal = streamChooser === 1 ? streamALastY : streamBLastY; 
      // append global array for Stream C curve values
      streamCVals.push(yVal); // Store the current value in the array
      // if streamCVals length exceeds streamCPointCount, remove the oldest value
      if (streamCVals.length > streamCPointCount) {
        streamCVals.shift(); // Remove the oldest value
      }
      
      let y = streamCStartY + (streamCHeight * 0.5) + curveVal * sineWaveHeight;
      let yVal = y; // Calculate the final y position with noise
      streamCLastY = yVal; // Store the last Y position
      vertex(streamsStartWidth + x, yVal); // plot the vertex
      // break; // exit the loop after plotting the last point

      // append to global array for Stream C label heights
      streamCLabelHeights.push(yVal);
      // Keep only the last 5 heights
      if (streamCLabelHeights.length > streamLabelHeightsMax) {
        streamCLabelHeights.shift(); // Remove the oldest height
      }
      // lerp the last 5 heights to get a stable label position
      avgYStreamC = streamCLabelHeights.reduce((a, b) => a + b, 0) / streamCLabelHeights.length;
    }
  }
  endShape();
  // Add label for Stream C
  fill(0, 50, 0, 255); // Green color for the label
  noStroke();
  text("Stream C Curve", streamsStartWidth + streamCWidth + 10, avgYStreamC);
  fill (0, 0, 0, 0); // reset fill color for next drawing
} // end of draw function
