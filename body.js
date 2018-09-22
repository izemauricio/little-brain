class Sensor {
    constructor(angle) {
        // The vector describes the sensor's direction
        this.dir = p5.Vector.fromAngle(angle);

        // This is the sensor's reading
        // Sensor value is the closest food
        this.val = 0;
    }
}
var totalSensors = 8; // number of sensor per body
var sensor_power = 150; // max distance that sensor it can see
var sensorAngle = (Math.PI * 2) / totalSensors; // angle between each sensor

// Mutation function to be passed into Vehicle's brain
function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Body {
    constructor(x, y, brain, parentGeneration) {

        // sensors
        this.sensors = [];

        // split the 360 between the desired number of sensors
        for (let angle = 0; angle < (Math.PI * 2); angle += sensorAngle) {
            this.sensors.push(new Sensor(angle));
        }

        // all sensors start with maximum length
        for (let j = 0; j < this.sensors.length; j++) {
            this.sensors[j].val = sensor_power;
        }

        // brain and its score and its generation
        this.score = 0;

        if(parentGeneration){
          this.generation = ++parentGeneration;
        }else{
          this.generation = 1;
        }

        let number_of_inputs = this.sensors.length + 6;
        if (brain) { // No need for brain != null.
          this.brain = brain.copy();
          this.brain.mutate(mutate);
        } else {
          this.brain = new NeuralNetwork(number_of_inputs, 32, 2);
        }

        // movement, position and size
        this.raio = 8;
        this.diameter = 2*this.raio;
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();
        this.force = createVector();

        // limits
        this.maxspeed = 4;
        this.minspeed = 0.25
        this.maxforce = 0.1;
        this.maxlife = 100;

        // shoot
        this.firerate = 0;
        this.reloadtime = random(10, 40);
        this.range = 100;

        // stats
        this.life = 1;
    }

    behave(index) {
        this.updateSensors(foods);
        this.eat(foods);
        this.think();
        this.checkWallCollisions();
        this.move();
        //this.shoot();
    }

    think() {
        // send input values to brain
        let inputs = [];

        // wall limits
        var w1 = constrain(map(this.position.x, FOOD_PADDING, 0, 0, 1), 0, 1);
        var w2 = constrain(map(this.position.y, FOOD_PADDING, 0, 0, 1), 0, 1);
        var w3 = constrain(map(this.position.x, width - FOOD_PADDING, width, 0, 1), 0, 1);
        var w4 = constrain(map(this.position.y, height - FOOD_PADDING, height, 0, 1), 0, 1);
        inputs.push(w1);
        inputs.push(w2);
        inputs.push(w3);
        inputs.push(w4);

        // velocity
        let vx = this.velocity.x / this.maxspeed;
        let vy = this.velocity.y / this.maxspeed;
        inputs.push(vx);
        inputs.push(vy);

        // distance sensors
        for (var i = 0; i < this.sensors.length; i++) {
            inputs.push(map(this.sensors[i].val, 0, sensor_power, 1, 0));
        }

        // get brain output
        let outputs = this.brain.predict(inputs);
        let desired = createVector(2 * outputs[0] - 1, 2 * outputs[1] - 1);
        //let desired = createVector(outputs[0]*2,outputs[1]*2);
        desired.mult(this.maxspeed);
        let steer = p5.Vector.sub(desired, this.velocity); // Craig Reynolds steering formula
        steer.limit(this.maxforce);
        this.force = steer;
        this.acceleration.add(this.force);
    }

    // eat the food if it is near the body
    eat(foods) {
        for (let i = foods.length - 1; i >= 0; i--) {
            let food = foods[i];
            let food_distance = p5.Vector.dist(food.position, this.position);
            if (food_distance < food.diameter/2) {
                this.life += food.life;
                foods.splice(i, 1);
            }
        }
    }

    clone() {
      return new Body(width/2, height/2, this.brain.copy(),this.generation);
    }

    move() {
        this.velocity.add(this.acceleration);

        this.velocity.limit(this.maxspeed);

        if (this.velocity.mag() < this.minspeed) {
            this.velocity.setMag(this.minspeed);
        }

        this.position.add(this.velocity);

        this.acceleration.mult(0);

        this.life = constrain(this.life, 0, this.maxlife);

        this.life -= 0.005;

        this.score += 1;
    }

    checkWallCollisions() {
      //TODO: FIX ME
        /*
            0 = se chegar no final da wall, ganha velocidade contraria
            1 = se chegar no final da wall, reaparece no outro lado
            2 = se chegar no final da wall, zera forca
            3 = se chegar no final da wall, morre
        */
        let wallmode = 3;

        if (wallmode == 0) {
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
        }else if (wallmode == 1) {
            if (this.position.x < 0) {
                this.position.x = width - this.position.x * -1
            }
            if (this.position.x > width) {
                this.position.x = (this.position.x - width)
            }
            if (this.position.y < 0) {
                this.position.y = height - this.position.y * -1
            }
            if (this.position.y > height) {
                this.position.y = (this.position.y - height)
            }
        }else if (wallmode == 3) {
            if (this.position.x > width || this.position.x < 0 || this.position.y > height  || this.position.y < 0) {
                this.life = 0;
            }
        }
    }

    isPregnant(prob) {
        return false;
    }

    isDead() {
        if (this.life < 0) {
            return true;
        }
       return false;
    }

    createForce(bodies, foods, bullets) {

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
        this.force = p5.Vector.sub(mouse, this.position);
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
        for (let j = 0; j < this.sensors.length; j++) {
          this.sensors[j].val = sensor_power;
        }


        // for each sensor, check if there is a food in the sensor fov
        for (let i = 0; i < this.sensors.length; i++) {
            let mysensor = this.sensors[i];

            // find the nearest food that is the sensor field of view
            let nearestFood = null;
            let nearestDist = 9999;
            for (let j = 0; j < foods.length; j++) {
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

            mysensor.val = nearestDist < sensor_power ? nearestDist : sensor_power;

        }
    }

    readSensors(foods) {
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
            line(myfood.position.x, myfood.position.y, this.position.x, this.position.y);

            // normalized vector direction to food

            // check all body sensors
            for (let j = 0; j < this.sensors.length; j++) {

                // If the relative angle of the food is in between the range
                let delta = this.sensors[j].dir.angleBetween(toFood);

                stroke(255, 0, 0);
                line(this.position.x, this.position.y, this.position.x + delta.x * 100, this.position.y + delta.y * 100);

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

    // DRAW STUFF
    draw() {
        this.drawBody();

        if (debug.checked()) {
            this.drawLifeBar();
            this.drawSensorLines();
            this.drawVectors();
            //this.drawRangeCircle();
        }
    }

    drawArrow(base, vec, myColor) {
        push();
        stroke(255,0,0);
        strokeWeight(1);
        fill(255,0,0);

        translate(base.x, base.y);
        line(0, 0, vec.x, vec.y);
        rotate(vec.heading());
        var arrowSize = 7;
        translate(vec.mag() - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
      }

    drawVectors() {

        // draw score n life
        push();
        fill(255);
        stroke(0);
        textSize(20);
        text(this.score +"/"+ int(this.life),this.position.x,this.position.y);
        pop();

        // draw force
        push();
        let vv = this.force;
        vv.normalize();
        let v0 = createVector(this.position.x, this.position.y);
        let v1 = createVector(vv.x * this.raio*4,vv.y * this.raio*4);
        //let v1 = createVector(vv.x,vv.y);
        this.drawArrow(v0, v1, 'red');
        pop();
    }

    drawLifeBar() {
        //lerpcolor = Linear Interpolation for Color
        //https://www.youtube.com/watch?v=8uLVnM36XUc
        // todo: smooth between 3 colors: red, yellow and green instead of the whole color spectrum.

        let r = color(255, 0, 0);
        let g = color(0, 255, 0);
        let b = color(0, 0, 255);
        let normalized_life = map(this.life, 0, this.maxlife, 0, 25);
        let life_color = map(normalized_life, 0, 15, 0, 1);
        var life_color_nice = lerpColor(r, g, life_color);
        push();
        fill(life_color_nice);
        rect(this.position.x + 15, this.position.y+this.raio, 4, -normalized_life);
        //text(this.life.toFixed(0),this.position.x + 15, this.position.y);
        pop();
    }

    drawSensorLines() {
        push();
        noFill();
        stroke(66, 232, 244, 100);
        for (let i = 0; i < this.sensors.length; i++) {
            let val = this.sensors[i].val;
            let pos = this.sensors[i].dir;
            if (val > 0) {
                strokeWeight(map(val, 0, sensor_power, 6, 0));
                line(this.position.x, this.position.y, this.position.x + pos.x * val, this.position.y + pos.y * val);
                //text("VAL: " + val + " - POS: " + position2.x + "," + position2.y, this.position.x, this.position.y + (15 * (i + 1)));
            }
        }
        pop();
    }

    drawHighlight() {
        //console.log("output1:"+ (this.o1*2-1) + "  output2:" + (this.o2*2-1));
        fill(255, 255, 0, 100);
        stroke(255,255,0);
        line(this.position.x,this.position.y,
          this.position.x+ this.o1*100,this.position.y + this.o2*100);
    
        fill(255, 0, 255, 100);
        stroke(255,0,255);
        line(this.position.x,this.position.y,
          this.position.x+ (this.o1*2 - 1)*this.maxspeed*10,this.position.y + (this.o2*2 -1 ) *this.maxspeed*10);
    
        fill(255, 255, 255, 50);
        stroke(255);
        ellipse(this.position.x, this.position.y, 32, 32);
      }

    drawRangeCircle() {
        push();
        noFill();
        stroke(255, 0, 0, 50);
        strokeWeight(1);
        ellipse(this.position.x, this.position.y, sensor_power * 2);
        pop();
    }

    drawBody() {
        // angle of the vector velocity + 90 graus
        var theta = this.velocity.heading() + (PI / 2);

        let r = color(255, 0, 0);
        let g = color(0, 255, 0);
        let b = color(0, 0, 255);
        let normalized_life = map(this.life, 0, this.maxlife, 0, 25);
        let life_color = map(normalized_life, 0, 15, 0, 1);
        var life_color_nice = lerpColor(r, g, life_color);

        push();

        translate(this.position.x, this.position.y);
        rotate(theta);

        //fill(life_color_nice,255);
        fill(80,220,255,200);
        //noFill();
        stroke(0, 0, 0);
        strokeWeight(1);

        beginShape();
        vertex(0, -this.raio * 2);
        vertex(-this.raio, this.raio * 2);
        vertex(this.raio, this.raio * 2);
        endShape();

        pop();
    }
}
