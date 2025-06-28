// This file is a p5.js sketch that draws circles at the mouse position
function setup() {
	createCanvas(windowWidth, windowHeight);
}

function arraysEqual(a=[], b=[]) {
    // check if a and b have the same length and if all elements are equal
    return a.length === b.length && a.every((val, idx) => val === b[idx]);
}

let circlesPos = [[0, 0]]; // Initialize with a default position
let circlesMaxCount = 100;

function draw() {
    background(100);
    let randSeed = randomSeed(2415);
	let newCirclesPos = [mouseX, mouseY];
    let lastPos = circlesPos[circlesPos.length - 1];
    let textPos = `this[${newCirclesPos}],last[${lastPos}]`;
    let textMsg = "skipped";
    // javascript does not have a built-in way to compare arrays
    // so we implement our own function
    if (!arraysEqual(newCirclesPos, lastPos)) { // Clean and expressive
        textMsg = "added";
        // add the new circle position to the array
        circlesPos.push(newCirclesPos); 
        if (circlesPos.length > circlesMaxCount) {
            circlesPos.shift(); // remove the oldest circle position
        }
    }
    for (let i = 0; i < circlesPos.length; i++) {
        let pos = circlesPos[i];
        // normalize the index to a value between 0 and 1
        let nmlLength = map(i, 0, circlesPos.length - 1, 0, 1); 
        // stroke(255 * normalizedLength, 0, 255 * (1 - normalizedLength));
        let col = color((255 * nmlLength), 0, (255 * (1 - nmlLength)));
        stroke(col);
        fill(col);
        let radius = (1 - nmlLength) * 20;
        circle(pos[0], pos[1], radius);
    } // draw the circles
    stroke(180);
    fill(180);
    textSize(25);
    textAlign(LEFT, TOP);
    text(`${textMsg}: ${textPos}`, 10, 20);
	// circle(mouseX, mouseY, 20);
}