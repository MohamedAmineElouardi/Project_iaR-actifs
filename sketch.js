let pursuers = [];
let target;
let obstacles = [];
let bgImage;
let obstacleImage;
let targetImage;
let followerImage;

function preload() {
  // Load your background, obstacle, target, and follower images
  bgImage = loadImage('./assets/pexels-philippedonn-1169754.jpg');
  obstacleImage = loadImage('./assets/icon.png');
  targetImage = loadImage('./assets/Moon.png');
  followerImage = loadImage('./assets/Planet3.png'); // Load follower image asset
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Resume AudioContext on user interaction
  getAudioContext().resume();

  // Create the leader (the first vehicle)
  pursuers.push(new Vehicle(100, 100, true)); // Leader has a flag

  // Create 6 followers that will follow the leader
  for (let i = 0; i < 6; i++) {
    let follower = new Vehicle(100, 100 + (i + 1) * 20, false); // Followers
    pursuers.push(follower);
  }

  // Create fixed obstacles with your asset
  obstacles.push(new Obstacle(width / 4, height / 2, 100));
  obstacles.push(new Obstacle(width / 2, height / 4, 100));
  obstacles.push(new Obstacle(width / 2, height / 1.5, 100));
  obstacles.push(new Obstacle(width / 1.5, height / 2, 100));
}

function draw() {
  // Draw the background image
  image(bgImage, 0, 0, width, height);

  target = createVector(mouseX, mouseY);

  // Draw the target using your target image
  image(targetImage, target.x - 16, target.y - 16, 32, 32); // Adjust the size if needed

  // Draw obstacles using the image
  obstacles.forEach(o => o.show());

  // Update and draw each pursuer
  for (let i = 0; i < pursuers.length; i++) {
    let pursuer = pursuers[i];

    if (i === 0) {
      // The leader (first pursuer) follows the target (the mouse)
      pursuer.applyBehaviors(target, obstacles);
    } else {
      // The followers follow the vehicle ahead of them
      let leader = pursuers[i - 1];
      pursuer.applyBehaviors(leader.position, obstacles);
    }

    pursuer.update();
    pursuer.show();
  }
}

function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    console.log("AudioContext resumed");
  }
}

// Updated Vehicle class
class Vehicle {
  constructor(x, y, isLeader) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.1;
    this.size = 16;
    this.isLeader = isLeader; // Flag to differentiate leader and followers
  }

  applyBehaviors(target, obstacles) {
    let seekForce = this.seek(target);
    let avoidForce = this.avoid(obstacles);
    seekForce.mult(1);
    avoidForce.mult(5);

    this.acceleration.add(seekForce);
    this.acceleration.add(avoidForce);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);

    let steering = p5.Vector.sub(desired, this.velocity);
    steering.limit(this.maxForce);
    return steering;
  }

  avoid(obstacles) {
    let steering = createVector(0, 0);
    let count = 0;

    for (let o of obstacles) {
      let distance = dist(this.position.x, this.position.y, o.position.x, o.position.y);
      if (distance < o.size + this.size) {
        let diff = p5.Vector.sub(this.position, o.position);
        diff.normalize();
        diff.div(distance);
        steering.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steering.div(count);
    }

    if (steering.mag() > 0) {
      steering.normalize();
      steering.mult(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }

    return steering;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    if (this.isLeader) {
      // Draw the leader (green circle)
      fill(0, 255, 0);
      noStroke();
      ellipse(this.position.x, this.position.y, this.size);
    } else {
      // Draw followers using the follower image
      image(followerImage, this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
    }
  }
}

// Updated Obstacle class
class Obstacle {
  constructor(x, y, size) {
    this.position = createVector(x, y);
    this.size = size;
  }

  show() {
    // Draw the obstacle image centered on its position
    image(obstacleImage, this.position.x - this.size, this.position.y - this.size, this.size * 2, this.size * 2);
  }
}
