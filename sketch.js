let particles = [];
const numParticles = 100;
const colors = ['#ff0000', '#ffffff', '#000000'];
const maxForce = 0.5;
const maxSpeed = 4;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-container');
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  clear();
  
  // Update and display particles
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.reset();
    this.y = random(height);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
  }
  
  reset() {
    this.position = createVector(random(width), random(height));
    this.size = random(2, 6);
    this.color = random(colors);
    this.alpha = random(100, 200);
    this.maxspeed = random(2, maxSpeed);
    this.maxforce = random(0.1, maxForce);
  }
  
  update() {
    // Calculate attraction to mouse
    if (mouseX !== 0 || mouseY !== 0) {
      let mouse = createVector(mouseX, mouseY);
      let dir = p5.Vector.sub(mouse, this.position);
      let d = dir.mag();
      
      // We want the particles to keep some distance from the mouse
      let minDistance = 50;
      let maxDistance = 200;
      
      if (d < maxDistance) {
        dir.normalize();
        
        // The closer to the mouse, the stronger the force
        let force = map(d, minDistance, maxDistance, this.maxforce, 0);
        dir.mult(force);
        
        // Add some randomness to make it more interesting
        dir.add(createVector(random(-0.1, 0.1), random(-0.1, 0.1)));
        
        this.acceleration.add(dir);
      }
    }
    
    // Update velocity and position
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    
    // Reset acceleration
    this.acceleration.mult(0);
    
    // Wrap around screen edges
    if (this.position.x < -10) this.position.x = width + 10;
    if (this.position.x > width + 10) this.position.x = -10;
    if (this.position.y < -10) this.position.y = height + 10;
    if (this.position.y > height + 10) this.position.y = -10;
  }
  
  display() {
    push();
    noStroke();
    let c = color(this.color);
    c.setAlpha(this.alpha);
    fill(c);
    
    // Create a subtle glow effect
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = this.color;
    
    circle(this.position.x, this.position.y, this.size);
    pop();
  }
} 