function Food() {
    this.x = random(1,width);
    this.y = random(1,height);
    this.position = createVector(this.x,this.y);
    this.diameter = 1;
    this.r = random(0,50);
    this.energy = random(50,300);
    this.pregnant = false;
    this.dead = false;
    this.age = random(10,500);
    this.nutrition = random(1,9);


    this.g = random(0,255);
    this.b = random(0,50);
    this.maxenergy = random(20,290);
    this.toxity = 1;

    this.move = function() {

      // mover plantas
      // this.position.add(random(-this.speed, this.speed),random(-this.speed, this.speed));

      /*
      if (this.energy< this.maxenergy) {
        this.energy += 0.05;
      } else {
        this.energy -= 0.05;
      }

      this.age+=0.2;
      */

    };

    this.draw = function() {
      drawingContext.shadowBlur = 2;
      drawingContext.shadowColor = "green";

      fill(this.toxity,255,0);
      ellipse(this.position.x, this.position.y, this.nutrition, this.nutrition);

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

  Food.prototype.grow = function(index){
    for(var i = 0 ; i<foods.length; i++){
      if(i == index) continue;

      var distance = p5.Vector.sub(foods[i].position, this.position);
      if(distance.mag() < foods[i].nutrition/2 + this.nutrition/2 +1){
        return;
      }
    }
    if(this.nutrition <50){
        this.nutrition +=0.5;
    }
  }

  Food.prototype.outOfBoundaries = function(){
    var raio = this.nutirion/2;

  }


  Food.prototype.toBehave = function(index){
    this.move();
    this.draw();
    this.checkdeath();
    this.checkpregnant();
    this.grow(index);
    if(this.dead) {
        //foods.splice(index,1);
        return;
    }
    if(this.pregnant && foods.length < foodLimit) {
        this.pregnant = false;
        //foods.push(new Food());
    }
  }
