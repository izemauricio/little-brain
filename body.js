function Body(x,y) {

    this.position = createVector(x,y);
    this.acceleration = createVector();
    this.force = createVector();
    this.velocity = p5.Vector.random2D();
    this.maxspeed = random(0.2,0.8);
    this.maxforce = 0.5;
    this.r = 5;
    this.diameter = random(10, 30);
    this.speed = 1;
    this.red = random(100,255);
    this.green = random(0,40);
    this.blue = random(100,255);
    this.energy = random(0,800);
    this.age = 0;
    this.pregnant = false;
    this.dead = false;


    this.move = function() {
        //this.x += random(-this.speed, this.speed);
        //this.y += random(-this.speed, this.speed);
        //this.position.add(this.x,this.y);
        this.age += 0.5;
        this.acceleration.set(this.force);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        this.energy -= this.velocity.mag();
        this.acceleration.mult(0);
    };

    this.draw = function() {
        //line(this.position.x,this.position.y,this.force.x,this.force.y)

        var theta = this.velocity.heading() + PI / 2;
        push();

        //text("e="+this.energy,this.position.x+10,this.position.y);
        if(debug.checked()){
          var reda = color(255,0,0);
          var greena = color(0,255,0);
          var life = map(this.energy,0,400,0,15);
          var lifeColor = map(life,0,10,0,1);
          //lerpcolor = Linear Interpolation for Color
          //https://www.youtube.com/watch?v=8uLVnM36XUc
          var barHealthColor = lerpColor(reda, greena, lifeColor);
          fill(barHealthColor);
          stroke(barHealthColor);
          rect(this.position.x+15,this.position.y,4,-life);
        }

        fill(this.red,this.green,this.blue);
        stroke(this.red,this.green,this.blue);
        translate(this.position.x, this.position.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    };
  }

Body.prototype.checkwall = function() {
    var d = 1;
    var desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.setMag(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.force.set(steer);
    }

  }

  Body.prototype.checkpregnant = function() {
    if (this.energy > 1000 && this.age > 50) {
        //this.pregnant = true;
        this.energy = 500;
    }
  }

  Body.prototype.checkdeath = function() {
    if (this.energy <= 0) {
        this.dead = true;
    }
  }

Body.prototype.createforce = function(bodies,foods, bullets) {
    var lowdist = Infinity;
    var thebody = null;
    /*
    if(this.energy<200) {
        this.maxspeed = 0.1;
    } else {
        this.maxspeed = 1;
    }
    */

    // check distances
    for (var i=0; i < foods.length; i++) {
        var target = foods[i];

        if (this == target)
            continue;
        //line(this.position.x,this.position.y,foods[i].position.x,foods[i].position.y);

        var distance = p5.Vector.dist(target.position,this.position);

        // eat food
        if (distance < 10) {
            this.energy += target.energy - target.toxity;
            foods.splice(i,1);
            return;
        }

        // find nearest food
        if (distance < lowdist) {
            lowdist = distance;
            thebody = foods[i];
        }
    }

    if(thebody==null) {
        return;
    }
    var desired = p5.Vector.sub(thebody.position, this.position);
    this.force.set(desired);

    //text("e="+this.energy,this.position.x,this.position.y);
    //text("low="+lowdist,this.position.x,this.position.y+30);
    //var steer = p5.Vector.sub(desired, this.velocity);
    //text("force x="+this.force.x+" y="+this.force.y,this.position.x,this.position.y);

    for (var i=0; i < bodies.length; i++) {
        if (this == bodies[i])
            continue;

        var distance = p5.Vector.dist(foods[i].position,this.position);

        if (distance < 10) {
            this.energy += foods[i].energy - foods[i].toxity;
            foods.splice(i,1);
            return;
        }

        if (distance < lowdist) {
            lowdist = distance;
            thebody = foods[i];
        }
    }
    if (thebody == null) {
        return;
    }
    bullets.push(new Bullet(this.position, thebody.position))

}


Body.prototype.toBehave = function(index){
  this.createforce(bodies,foods,bullets);
  this.checkwall();
  this.move();
  this.draw();
  this.checkdeath();
  this.checkpregnant();
  if(this.dead) {
      bodies.splice(index,1);
      return;
  }
  if(this.pregnant && bodies.length < bodyLimit) {
      this.pregnant = false;
      bodies.push(new Body());
      return;
  }
}
