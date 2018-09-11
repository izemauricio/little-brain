function Food() {
    this.x = random(600);
    this.y = random(600);
    this.position = createVector(this.x,this.y);
    this.diameter = random(10, 30);
    this.speed = 1;
    this.r = random(0,255);
    this.g = random(0,255);
    this.b = random(0,255);
    this.energy = random(50,100);
  
    this.move = function() {
      this.position.add(random(-this.speed, this.speed),random(-this.speed, this.speed));
      
      if (this.energy<100) {
        this.energy++;
      } else {
        this.energy--;
      }
      if (this.energy==0) {
        this.energy=50;
      }

    };
  
    this.display = function() {
        fill(this.r,this.g,this.b);
        ellipse(this.position.x, this.position.y, this.energy/4, this.energy/4);
    };
  }