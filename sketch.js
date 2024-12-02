let vehicles = [];
let target;
let mode = "snake";
let vitesseMaxSlider, accelerationMaxSlider, pathLengthSlider, moonCountSlider;
let bg, leaderImage, followerImage, predatorImage;
let predator;

function preload() {
  bg = loadImage('assets/space.jpg');
  leaderImage = loadImage('assets/Planet.png');
  followerImage = loadImage('assets/Moon.png');
  predatorImage = loadImage('assets/Planet3.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  target = createVector(random(width), random(height));
  predator = new Predator(random(width), random(height));

  vitesseMaxSlider = createSlider(1, 20, 2, 1);
  vitesseMaxSlider.position(920, 10);
  createLabel("Vitesse Max", vitesseMaxSlider);

  accelerationMaxSlider = createSlider(0.1, 2, 0.25, 0.01);
  accelerationMaxSlider.position(920, 40);
  createLabel("Accélération Max", accelerationMaxSlider);

  pathLengthSlider = createSlider(10, 150, 20, 1);
  pathLengthSlider.position(920, 70);
  createLabel("Longueur de la Traînée", pathLengthSlider);

  moonCountSlider = createSlider(1, 20, 10, 1);
  moonCountSlider.position(920, 100);
  createLabel("Nombre de Lunes", moonCountSlider);
}

function draw() {
  image(bg, 0, 0, width, height);

  let moonCount = moonCountSlider.value();
  adjustVehicleCount(moonCount);

  target.x = mouseX;
  target.y = mouseY;

  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  let maxSpeed = vitesseMaxSlider.value();
  let maxForce = accelerationMaxSlider.value();
  let pathLength = pathLengthSlider.value();

  fill(255);
  textSize(16);
  text("Changer le mode : 'l' pour Leader, 's' pour Snake", 10, height - 30);

  if (mode === "snake") {
    drawSnake(maxSpeed, maxForce, pathLength);
  } else if (mode === "leader") {
    drawLeaderFollower(maxSpeed, maxForce, pathLength);
  }

  predator.chase(vehicles);
  predator.update();
  predator.show();
}

function drawSnake(maxSpeed, maxForce, pathLength) {
  vehicles[0].applyBehaviors(target);
  vehicles[0].maxSpeed = maxSpeed;
  vehicles[0].maxForce = maxForce;
  vehicles[0].pathLength = pathLength;
  vehicles[0].update();
  vehicles[0].edges();
  vehicles[0].show();

  for (let i = 1; i < vehicles.length; i++) {
    vehicles[i].applyBehaviors(vehicles[i - 1].pos);
    vehicles[i].maxSpeed = maxSpeed;
    vehicles[i].maxForce = maxForce;
    vehicles[i].pathLength = pathLength;
    vehicles[i].update();
    vehicles[i].edges();
    vehicles[i].show();
  }
}

function drawLeaderFollower(maxSpeed, maxForce, pathLength) {
  vehicles.forEach((vehicle, i) => {
    let neighbors = vehicles.filter((_, j) => j !== i);
    vehicle.applyBehaviors(target, neighbors);
    vehicle.maxSpeed = maxSpeed;
    vehicle.maxForce = maxForce;
    vehicle.pathLength = pathLength;
    vehicle.update();
    vehicle.edges();
    vehicle.show();
  });
}

function adjustVehicleCount(count) {
  while (vehicles.length < count) {
    vehicles.push(new Vehicle(random(width), random(height), vehicles.length === 0));
  }
  while (vehicles.length > count) {
    vehicles.pop();
  }
}

function createLabel(label, slider) {
  let lib = createP(label);
  lib.position(slider.x + slider.width + 10, slider.y - 10);
  lib.style("color", "white");
}

function keyPressed() {
  if (key === "s") {
    mode = "snake";
  } else if (key === "l") {
    mode = "leader";
  }
}