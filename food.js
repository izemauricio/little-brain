function Food() {
    this.x = random(600);
    this.y = random(600);
    this.position = createVector(this.x,this.y);
    this.diameter = random(10, 30);
    this.speed = 0.2;
    this.r = random(0,50);
    this.g = random(0,255);
    this.b = random(0,50);
    this.energy = random(50,300);
    this.pregnant = false;
    this.dead = false;
    this.age = random(10,500);
    this.toxity = random(0,255);
    this.maxenergy = random(20,290);
  
    this.move = function() {
      this.position.add(random(-this.speed, this.speed),random(-this.speed, this.speed));
      
      if (this.energy< this.maxenergy) {
        this.energy += 0.05;
      } else {
        this.energy -= 0.05;
      }

      this.age+=0.2;

    };
  
    this.draw = function() {
      drawingContext.shadowBlur = 2;
      drawingContext.shadowColor = "green";

        fill(this.toxity,255,0);
        ellipse(this.position.x, this.position.y, this.age/8, this.age/8);

        drawingContext.shadowBlur = 0;
      drawingContext.shadowColor = "black";
    };
  }

  Food.prototype.checkpregnant = function() {
    if (this.age > 600) {
        //this.pregnant = true;
        this.age = 0;
    }
  }

  Food.prototype.checkdeath = function() {
    if (this.energy <= 0 || this.age > 1000) {
        this.dead = true;
    }
  }