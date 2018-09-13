class Food {

  constructor() {
    // position and size
    this.position = createVector(random(1, width), random(1, height));
    this.diameter = 1;

    // color
    this.r = random(0, 50);
    this.g = random(0, 255);
    this.b = random(0, 50);
    
    // status
    this.energy = random(50, 300);
    this.pregnant = false;
    this.dead = false;
    this.age = random(10, 500);
    this.nutrition = random(1, 9);
    this.toxity = 1;
    
    // rates and limits
    this.GROW_RATE = random(0.01,0.4);
    this.maxenergy = random(20, 290);
  }

  move() {
    // animate the plants
    // this.position.add(random(-this.speed, this.speed),random(-this.speed, this.speed));
  }

  draw() {
    // configure pen
    drawingContext.shadowBlur = 2;
    drawingContext.shadowColor = "green";
    strokeWeight(1);
    stroke(20, 100, 80);
    fill(20, 230, 80);

    // basic draw
    ellipse(this.position.x, this.position.y, this.nutrition, this.nutrition);

    // nice draw
    noFill();
    stroke(50, 50, 0);
    for (let i=this.nutrition; i>=1; i-=7) {
      ellipse(this.position.x, this.position.y, i, i);
    }
  }

  check_pregnant() {
    if (this.age > 600) {
      //this.pregnant = true;
      //this.age = 0;
    }
  }

  check_death() {
    if (this.energy <= 0 || this.age > 1000) {
      this.dead = true;
    }
  }

  grow(index) {
    for (var i = 0; i < foods.length; i++) {
      if (i == index) 
        continue;
  
      var distance = p5.Vector.sub(foods[i].position, this.position);
      if (distance.mag() < foods[i].nutrition / 2 + this.nutrition / 2 + 1) {
        return;
      }
    }

    if (this.nutrition < 50) {
      this.nutrition += this.GROW_RATE;
    }
  }

  outOfBoundaries() {
    var raio = this.nutirion / 2;
  }
  
  toBehave(index) {
    this.move();
    this.draw();
    this.check_death();
    this.check_pregnant();
    this.grow(index);
    if (this.dead) {
      //foods.splice(index,1);
      return;
    }
    if (this.pregnant && foods.length < foodLimit) {
      this.pregnant = false;
      //foods.push(new Food());
    }
  }

}