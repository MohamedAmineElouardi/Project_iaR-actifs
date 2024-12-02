

class Vehicle {
    constructor(x, y, isLeader = false) {
      this.pos = createVector(x, y);
      this.vel = createVector(random(-1, 1), random(-1, 1));
      this.acc = createVector(0, 0);
      this.maxSpeed = 4;
      this.maxForce = 0.1;
      this.r = 16;
      this.pathLength = 20;
      this.path = [];
      this.isLeader = isLeader;
    }
  
    applyBehaviors(target, neighbors = []) {
      let seekForce = this.seek(target);
      let separateForce = this.separate(neighbors);
      this.applyForce(seekForce);
      this.applyForce(separateForce);
    }
  
    seek(target) {
      let desired = p5.Vector.sub(target, this.pos);
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
  
    separate(neighbors) {
      let desiredSeparation = this.r * 2;
      let steer = createVector(0, 0);
      let count = 0;
  
      neighbors.forEach((other) => {
        let d = p5.Vector.dist(this.pos, other.pos);
        if (d > 0 && d < desiredSeparation) {
          let diff = p5.Vector.sub(this.pos, other.pos);
          diff.normalize();
          diff.div(d);
          steer.add(diff);
          count++;
        }
      });
  
      if (count > 0) {
        steer.div(count);
      }
  
      if (steer.mag() > 0) {
        steer.setMag(this.maxSpeed);
        steer.sub(this.vel);
        steer.limit(this.maxForce);
      }
  
      return steer;
    }
  
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
  
      this.path.push(this.pos.copy());
      if (this.path.length > this.pathLength) {
        this.path.shift();
      }
    }
  
    show() {
      this.path.forEach((p, index) => {
        if (index % 3 === 0) {
          stroke(255);
          fill(255);
          circle(p.x, p.y, 1);
        }
      });
  
      push();
      translate(this.pos.x, this.pos.y);
      imageMode(CENTER);
      if (this.isLeader) {
        image(leaderImage, 0, 0, this.r * 3, this.r * 3);
      } else {
        image(followerImage, 0, 0, this.r * 2, this.r * 2);
      }
      pop();
    }
  
    edges() {
      if (this.pos.x > width) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = width;
      if (this.pos.y > height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = height;
    }
  }