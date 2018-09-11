function Bullet(origin, target) {

    this.position = createVector(origin.x,origin.y);
    this.velocity = p5.Vector.sub(target, this.position);
    this.acceleration = createVector();
  
    this.maxspeed = 3;
    this.velocity.setMag(this.maxspeed);
    this.damage = 0.1;
    this.target = target;
  
    var offsetPos = p5.Vector.sub(this.target, this.position);
    offsetPos.limit(1);
    offsetPos.mult(4);
    this.position.add(offsetPos);

  }
  
  Bullet.prototype.move = function(){
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
  }
  
  Bullet.prototype.draw = function() {
    push();
    translate(this.position.x, this.position.y);
    beginShape();
    fill(255, 0, 0);
    noStroke();
    ellipse(0, 0, 4);
    endShape(CLOSE);
    pop();
  }
  
  Bullet.prototype.checkhit = function(bodies){
    for(var i = 0 ; i < bodies.length ; i++){
        var dist = p5.Vector.dist(this.position, bodies[i].position);
        if(dist <3){
            bodies[i].energy -= this.damage;
          return true;
        }
    }
    return false;
  }
  
  Bullet.prototype.checkwall = function(){
    var d = 10;
    if (this.position.x < d || this.position.x > width - d || this.position.y < d || this.position.y > height - d) {
      return true;
    }
    return false;
  }