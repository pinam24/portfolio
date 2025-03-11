let pipes = [];
let bird;
let playing = false;

let birdImg, pipeImg, pipeRevImg;
let handPose;
let video;
let hands = [];

function preload() {
  birdImg = loadImage('assets/bird.png');
  pipeImg = loadImage('assets/pipes.png');
  pipeRevImg = loadImage('assets/pipes_reverse.png');
  backgroundImg = loadImage('assets/background.png');
  handPose = ml5.handPose();
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('game-container');
  frameRate(40);
  bird = new Bird(width / 3, height / 3);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(50);

  video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0, width, height);
  background(backgroundImg); // Restore the background image

  // Add a subtle red gradient effect
  let gradient = drawingContext.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(255, 0, 0, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  drawingContext.fillStyle = gradient;
  rect(0, 0, width, height);

  if (frameCount % 50 == 0) {
    pipes.push(new Pipe());
    playing = true;
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();
    if (pipes[i].offScreen()) {
      if (pipes[i].pass(bird)) {
        bird.score++;
      }
      pipes.splice(i, 1);
    }
    if (pipes[i].hit(bird)) {
      strokeWeight(8);
      rectMode(CENTER);
      fill(0);
      stroke('#ff0000');
      rect(width / 2, height / 2, width - 80, 80);
      fill('#ff0000');
      noStroke();
      text("Score: " + bird.score, width / 2, height / 2);
      playing = false;
      noLoop();
    }
  }

  // Update bird position to follow index finger
  if (hands.length > 0) {
    let finger = hands[0].index_finger_tip;
    if (finger) {
      bird.x = finger.x;
      bird.y = finger.y;
    }
  }

  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let finger = hands[i].index_finger_tip;
    if (finger) {
      fill('#ff0000');
      stroke(0);
      strokeWeight(2);
      circle(finger.x, finger.y, 10);
    }
  }

  // Draw bird
  bird.show();
  
  // Show the current score
  if (playing) {
    fill('#ff0000');
    stroke(0);
    strokeWeight(2);
    text(bird.score, width / 2, height / 5);
  }
  if (pipes.length - 1 < 0) {
    fill('#ff0000');
    stroke(0);
    strokeWeight(2);
    textSize(30);
    text("Hold your index finger up\non the camera to\nmove the bird", width / 2, height / 3);
    textSize(50);
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  hands = results;
}
