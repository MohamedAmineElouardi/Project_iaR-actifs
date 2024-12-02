

class Predator {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(random(-1, 1), random(-1, 1));
      this.acc = createVector(0, 0);
      this.maxSpeed = 5;
      this.maxForce = 0.2;
      this.r = 20;
    }
  
    chase(vehicles) {
      let closest = null;
      let closestDist = Infinity;
      let closestIndex = -1;
  
      vehicles.forEach((vehicle, index) => {
        let d = p5.Vector.dist(this.pos, vehicle.pos);
        if (d < closestDist) {
          closest = vehicle;
          closestDist = d;
          closestIndex = index;
        }
      });
  
      if (closest && closestDist < this.r) {
        vehicles.splice(closestIndex, 1); 
      }
  
      if (closest) {
        let seekForce = this.seek(closest.pos);
        this.applyForce(seekForce);
      }
    }
  
    seek(target) {
      let desired = p5.Vector.sub(target, this.pos);
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
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
    }
  
    show() {
      push();
      translate(this.pos.x, this.pos.y);
      imageMode(CENTER);
      image(predatorImage, 0, 0, this.r * 2.5, this.r * 2.5);
      pop();
    }
  }
  