class Food {
  constructor() {
    this.position = createVector(random(1, width - 1), random(1, height - 1));
    this.mindiameter = 15;
    this.maxdiameter = 80;
    this.diameter = this.mindiameter;
    this.life = random(0,this.maxlife);
    this.toxity = 1;
    this.growrate = random(0.1, 0.3);
    this.maxlife = random(10, 1000);
  }

  behave(index) {
    this.grow(index);
  }

  grow(index) {
    // update food size from its life
    this.diameter = map(this.life, 0, this.maxlife, this.mindiameter, this.maxdiameter);

    // avoid food overlap
    for (var i = 0; i < foods.length; i++) {
      if (i == index)
        continue;

      var distance = p5.Vector.sub(foods[i].position, this.position);

      if (distance.mag() < (foods[i].diameter/2 + this.diameter/2 + 1)) {
        return;
      }
    }

    // grow
    if (this.life < this.maxlife) {
      this.life += this.growrate;
    }
  }

  draw() {
    push();
    //drawingContext.shadowBlur = 0;
    //drawingContext.shadowColor = "green";
    //drawingContext.shadowOffsetX = 0;
    //drawingContext.shadowOffsetY = 0;
    strokeWeight(0);
    stroke(20, 100, 80);
    fill(20, 230, 110, 255);
    //noFill();
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
    fill(20, 150, 40, 255);
    if (debug.checked()) {
      var stringLife = this.life.toFixed(0);
      //balance the life in the center of the food.
      text(stringLife,this.position.x-stringLife.length*3-1,this.position.y+5);
    }
    pop();
  }
}
