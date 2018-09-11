function Body() {
    this.x = random(600);
    this.y = random(600);
    this.position = createVector(this.x, this.y);
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
        fill(this.red,this.green,this.blue);
        var theta = this.velocity.heading() + PI / 2;
        push();
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
    var d = 10;
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
        this.pregnant = true;
        this.energy = 500;
    }
  }

  Body.prototype.checkdeath = function() {
    if (this.energy <= 0) {
        this.dead = true;
    }
  }

Body.prototype.createforce = function(foods,bodies) {
    var lowdist = Infinity;
    var thebody = null;
    /*
    if(this.energy<200) {
        this.maxspeed = 0.1;
    } else {
        this.maxspeed = 1;
    }
    */
    for (var i=0; i < bodies.length; i++) {
        if (this == bodies[i]) continue;
        //line(this.position.x,this.position.y,bodies[i].position.x,bodies[i].position.y);
        
        var dist = p5.Vector.dist(bodies[i].position,this.position);
        
        if (dist < 10) {
            this.energy += bodies[i].energy - bodies[i].toxity;
            bodies.splice(i,1);
            return;
        }

        if (dist < lowdist) {
            lowdist = dist;
            thebody = bodies[i];
        }
    }
    if(thebody==null) return;
    text("e="+this.energy,this.position.x,this.position.y);
    //text("low="+lowdist,this.position.x,this.position.y+30);
    var desired = p5.Vector.sub(thebody.position, this.position);
    //var steer = p5.Vector.sub(desired, this.velocity);
    this.force.set(desired);
    //text("force x="+this.force.x+" y="+this.force.y,this.position.x,this.position.y);
}