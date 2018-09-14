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
 var totalSensors = 12;
 // How far can each vehicle see?
 var sensor_power = 150;
 // What's the angle in between sensors
 var sensorAngle = (Math.PI * 2) / totalSensors;

class Body {
    constructor(x,y) {

        // position and size
        this.position = createVector(x,y);
        this.diameter = random(10, 30);
        this.r = 5;

        // color 
        this.red = random(100, 255);
        this.green = random(0, 40);
        this.blue = random(100, 255);

        // movement
        this.force = createVector();
        this.acceleration = createVector();
        this.velocity = p5.Vector.random2D();
        this.maxspeed = 1;
        this.maxforce = 0.05;
        
        // status
        this.energy = this.maxlife;
        this.speed = 1;
        this.mass = 10;
        this.age = 0;
        this.pregnant = false;
        this.dead = false;

        // rates and limits
        this.maxlife = 3000;
        
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

    }

    toBehave(index) {
        this.createforce(bodies, foods, bullets);
        //this.readsensors(foods);
        this.updateSensors(foods);
        this.checkwall();
        this.move();
        this.draw();
        this.checkdeath();
        this.checkpregnant();
        this.shoot(bodies);
        if (this.dead) {
            //bodies.splice(index,1);
            return;
        }
        if (this.pregnant && bodies.length < bodyLimit) {
            this.pregnant = false;
            //bodies.push(new Body());
            return;
        }
    }

    move() {
        this.force.limit(this.maxforce);
        this.acceleration.set(this.force);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
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

    checkpregnant() {
        if (this.energy > 1000 && this.age > 50) {
            //this.pregnant = true;
            //this.energy = 500;
        }
    }

    checkdeath() {
        if (this.energy <= 0) {
            this.dead = true;
        }
    }

    createforce(bodies, foods, bullets) {

        let mouse = createVector(mouseX, mouseY);
        this.force = p5.Vector.sub(mouse,this.position);



        
        var lowdist = Infinity;
        var thebody = null;
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

                let toFood = p5.Vector.sub(myfood.position, this.position);

                let delta = mysensor.dir.angleBetween(toFood);

                // check if food is in the sensor fov
                if (delta > sensorAngle / 2) {
                    continue;
                }

                // check if food is near enough
                if (distance > sensor_power) {
                    continue;
                }

                // check if this is the neasrest so far
                if (distance < nearestDist) {
                    nearestFood = myfood;
                    nearestDist = distance;
                }
            }
            
            if (nearestDist < sensor_power) {
                mysensor.val = nearestDist;
            } else {
                mysensor.val = sensor_power;
            }
            
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
        //text("firerate="+this.firerate,this.position.x,this.position.y);
    }
    
    draw() {
        // angle of the vector velocity + 90 graus
        var theta = this.velocity.heading() + (PI/2);
    
        push();
    
        if (debug.checked()) {
            this.drawLifeBar();
            this.drawSensorLines();
            this.drawRangeCircle();
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
        let life = map(this.energy, 0, this.maxlife, 0, 15);
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
        stroke(255, 255, 255);

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