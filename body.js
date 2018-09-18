
// color
//let red = random(100, 255);
//let green = random(0, 40);
//let blue = random(100, 255);

// rates and limits
maxlife = 100;

// This is a class for an individual sensor
// Each vehicle will have N sensors
class Sensor {
    constructor(angle) {
        // The vector describes the sensor's direction
        this.dir = p5.Vector.fromAngle(angle);

        // This is the sensor's reading
        // Sensor value is the closest food
        this.val = 0;
    }
}

 // body sensor setup
 // How many sensors does each vehicle have?
 var totalSensors = 8;
 // How far can each vehicle see?
 var sensor_power = 150;
 // What's the angle in between sensors
 var sensorAngle = (Math.PI * 2) / totalSensors;

class Body {
    constructor(x,y) {
        // brain
        //this.brain = new NeuralNetwork(inputs, 32, 2);

        // position and size
        this.position = createVector(x,y);
        this.r = 5;

        // movement
        this.acceleration = createVector();
        this.velocity = p5.Vector.random2D();
        this.maxspeed = 4;
        this.minspeed = 0.25
        this.maxforce = 0.1;

        // status
        this.health = maxlife;
        this.age = 0;
        this.score =0;

        // shoot
        this.firerate = 0;
        this.reloadtime = random(10, 40);
        this.range = 100;

        // vision
        this.sensors = [];
        // Create an array of sensors
        for (let angle = 0; angle < (Math.PI * 2); angle += sensorAngle) {
            this.sensors.push(new Sensor(angle));
        }

        // All sensors start with maximum length
        for (let j = 0; j < this.sensors.length; j++) {
            this.sensors[j].val = sensor_power;
        }

        this.brain = new NeuralNetworkW(this.sensors.length, 32 , 2);

        //debug mode
        this.outputDebug =[];

    }

    toBehave(index) {
        //this.createforce(bodies, foods, bullets);
        //this.readsensors(foods);
        this.updateSensors(foods);
        this.eat(foods);
        this.think();
        circleWorld(this);
        //this.checkwall();
        this.move();

        //this.checkdeath();
        //this.checkpregnant();
        //this.shoot(bodies);

    }

    think(){

      let inputs = [];

      //velocity x and y normalized 0~1
      let velocityX = this.velocity.x / this.maxspeed;
      let velocityY = this.velocity.y / this.maxspeed;

      //sensors normalized 0~1
      for(var i = 0 ; i < this.sensors.length; i++){
        inputs.push(map(this.sensors[i].val, 0, sensor_power, 1,0));
      }
      let output = this.brain.supletivo(inputs);
      this.outputDebug = output;

      //Turn the output as a vector with low intensity
      let desired = createVector(output[0]*2-1, output[1]*2-1);
      //Give power to the direction
      desired.mult(this.maxspeed);
      // Craig Reynolds steering formula, smoothing the path
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      //Apply the force
      this.applyForce(steer);
    }

    // Check against array of food
    eat(list) {
      for (let i = list.length - 1; i >= 0; i--) {
        // Calculate distance
        let d = p5.Vector.dist(list[i].position, this.position);
        // If vehicle is within food radius, eat it!
        if (d < list[i].nutrition/2) {
          this.health += list[i].nutrition/2;
          list.splice(i, 1);
        }
      }
    }

    move() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        if (this.velocity.mag() < this.minspeed) {
          this.velocity.setMag(this.minspeed);
        }
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        // Decrease health
        this.health = constrain(this.health, 0, maxlife);
        this.health -= 0.1;
        // Increase score
        this.score += 1;
    }

    applyForce(force){
      this.acceleration.add(force);
    }

    grow() {
        this.age += 0.5;
    }

    checkwall() {
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

    reproduce(prob) {
      // Pick a random number
      let rand = random(1);
      // New vehicle with brain copy, otherwise return null;
      return rand < prob ? new Body(this.position.x,this.position.y) : null;
    }

    isDead() {
      return this.health <= 0;
    }

    createforce(bodies, foods, bullets) {

        // BRAIN MODE
        // inputs
        /*
        let inputs = [];
        for (let j = 0; j < this.sensors.length; j++) {
            inputs[j + 6] = map(this.sensors[j].val, 0, sensor_power, 1, 0); // mapeia val (0,150) to (1,0)
        }
        let outputs = this.brain.predict(inputs);
        let desired = createVector(2 * outputs[0] - 1, 2 * outputs[1] - 1);
        let steer = p5.Vector.sub(desired, this.velocity); // Craig Reynolds steering formula
        steer.limit(this.maxforce);
        this.force = steer;
        */
        let mouse = createVector(10, y);
        this.force = p5.Vector.sub(mouse,this.position);
        // MOUSE MODE
      //  let mouse = createVector(mouseX, mouseY);
        //this.force = p5.Vector.sub(mouse,this.position);

        // GOD MODE
        //var lowdist = Infinity;
        //var thebody = null;
        /*
        if(this.energy<200) {
            this.maxspeed = 0.1;
        } else {
            this.maxspeed = 1;
        }
        */

        /*
        // check food distances
        for (var i = 0; i < foods.length; i++) {
            var target = foods[i];

            if (this == target)
                continue;
            //line(this.position.x,this.position.y,foods[i].position.x,foods[i].position.y);

            var distance = p5.Vector.dist(target.position, this.position);

            // eat food
            if (distance < 30) {
                //this.energy += target.energy - target.toxity;
                foods.splice(i, 1);

                // restore sensors
                for (let k=0; k<this.sensors.length; k++) {
                    this.sensors[k].val = sensor_power;
                }

                return;
            }

            // find nearest food
            if (distance < lowdist) {
                lowdist = distance;
                thebody = foods[i];
            }
        }

        if (thebody == null) {
            return;
        }
        var desired = p5.Vector.sub(thebody.position, this.position);
        this.force.set(desired); */

        //text("e="+this.energy,this.position.x,this.position.y);
        //text("low="+lowdist,this.position.x,this.position.y+30);
        //var steer = p5.Vector.sub(desired, this.velocity);
        //text("force x="+this.force.x+" y="+this.force.y,this.position.x,this.position.y);



    }

    updateSensors(foods) {
        // for each sensor, check if there is a food in the sensor fov
        for (let i=0; i<this.sensors.length; i++) {
            let mysensor = this.sensors[i];

            // find the nearest food that is the sensor field of view
            let nearestFood = null;
            let nearestDist = 9999;
            for (let j=0; j<foods.length; j++) {
                let myfood = foods[j];

                let distance = p5.Vector.dist(this.position, myfood.position);

                // check if food is near enough
                if (distance > sensor_power) {
                    continue;
                }

                let toFood = p5.Vector.sub(myfood.position, this.position);

                let delta = mysensor.dir.angleBetween(toFood);

                // check if food is in the sensor fov
                if (delta > sensorAngle / 2) {
                    continue;
                }

                // check if this is the neasrest so far
                if (distance < nearestDist) {
                    nearestFood = myfood;
                    nearestDist = distance;
                }
            }

            mysensor.val = nearestDist < sensor_power? nearestDist : sensor_power;

        }
    }

    readsensors(foods) {
        for (var i = foods.length - 1; i >= 0; i--) {

            // the food
            let myfood = foods[i];

            // how far is food
            let distance = p5.Vector.dist(this.position, myfood.position);

            // skip if food is too far away
            if (distance > sensor_power) {
                continue;
            }

            // vector to food
            let toFood = p5.Vector.sub(myfood.position, this.position);

            stroke(133);
            noFill();
            line(myfood.position.x,myfood.position.y,this.position.x,this.position.y);

            // normalized vector direction to food

            // check all body sensors
            for (let j = 0; j < this.sensors.length; j++) {

                // If the relative angle of the food is in between the range
                let delta = this.sensors[j].dir.angleBetween(toFood);

                stroke(255,0,0);
                line(this.position.x,this.position.y,this.position.x + delta.x * 100,this.position.y + delta.y * 100);

                if (delta < sensorAngle / 2) {
                    // Sensor value is the closest food
                    //this.sensors[j].val = min(this.sensors[j].val, distance);
                    this.sensors[j].val = distance;

                } else {
                    this.sensors[j].val = sensor_power;
                }
            }
        }
    }

    shoot(bodies) {
        if (this.firerate <= this.reloadtime) {
            this.firerate++;
        }

        var lowdist = Infinity;
        var thebody = null;

        // check bodies distance
        for (var i = 0; i < bodies.length; i++) {
            if (this == bodies[i])
                continue;

            var distance = p5.Vector.dist(bodies[i].position, this.position);

            if (distance < lowdist) {
                lowdist = distance;
                thebody = bodies[i];
            }
        }
        if (thebody == null) {
            return;
        }
        if (this.firerate >= this.reloadtime && lowdist < this.range) {
            bullets.push(new Bullet(this.position, thebody.position));
            this.firerate = 0;
        }
    }

    draw() {
        // angle of the vector velocity + 90 graus
        var theta = this.velocity.heading() + (PI/2);

        push();

        if (debug.checked()) {
            this.drawLifeBar();
            this.drawSensorLines();
            //this.drawRangeCircle();
            text(int(this.score), 10, 0);
        }

        // posiciona the body
        translate(this.position.x, this.position.y);

        // rotate the body
        rotate(theta);


        // draw the body
        this.drawBody();

        pop();
    }

    drawLifeBar() {
        //lerpcolor = Linear Interpolation for Color
        //https://www.youtube.com/watch?v=8uLVnM36XUc
        // todo: smooth between 3 colors: red, yellow and green instead of the whole color spectrum.

        let reda = color(255, 0, 0);
        let greena = color(0, 255, 0);
        let life = map(this.health, 0, maxlife, 0, 15);
        let lifeColor = map(life, 0, 10, 0, 1);
        var barHealthColor = lerpColor(reda, greena, lifeColor);

        fill(barHealthColor);
        stroke(barHealthColor);

        rect(this.position.x + 15, this.position.y, 4, -life);
    }

    drawSensorLines() {
        drawingContext.shadowBlur = 5;
        drawingContext.shadowColor = "cyan";
        //fill(255, 255, 255);
        noFill();
        stroke(255, 255, 255,80);

        for (let i = 0; i < this.sensors.length; i++) {
            let val = this.sensors[i].val;
            let pos = this.sensors[i].dir;

            if (val > 0) {
                //strokeWeight(map(val, 0, sensor_power, 4, 1));
                //drawingContext.shadowBlur = map(val, 0, sensorLength, 6, 1);

                line(this.position.x, this.position.y, this.position.x + pos.x * val,this.position.y + pos.y * val);

                //text("VAL: " + val + " - POS: " + position2.x + "," + position2.y, this.position.x, this.position.y + (15 * (i + 1)));
            }
        }
    }

    drawRangeCircle() {
        noFill();
        stroke(200, 0, 0);
        strokeWeight(1);
        drawingContext.shadowBlur = 0;

        ellipse(this.position.x, this.position.y, sensor_power* 2);
    }

    drawBody() {
        // color
        drawingContext.shadowBlur = 0;
        fill(255,255,0);
        //noFill();
        stroke(255,255,255  );
        strokeWeight(1);

        // shape
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
    }
}
