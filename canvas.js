/*
IDEAS

1. dna should tell: how fast, how strong, the gun power, the capacity-of-reading-food-toxity (0 to 1), vision power, etc
2. we need find a equilibrium between # of death and # of birth
3. 

*/

var bodies = [];
var foods = [];
var number_of_bodies = 5;
var number_of_foods = 50;

function setup() {
    var mycanvas = createCanvas(800, 800);
    mycanvas.parent('mycanvas');
    
    //noFill();
    stroke(1);
    strokeWeight(1);

    //drawingContext.shadowOffsetX = 5;
    //drawingContext.shadowOffsetY = -5;
    

    for (var i = 0; i < number_of_foods; i++) {
        foods[i] = new Food();
    }

    for (var i = 0; i < number_of_bodies; i++) {
        bodies[i] = new Body();
    }

    
}

function draw() {
    background(190);

    if (random(1,100) > 98 && foods.length < 30) {
        foods.push(new Food());
    }

    for (var i = 0; i < foods.length; i++) {
        foods[i].move();
        foods[i].display();
        foods[i].checkdeath();
        foods[i].checkpregnant();
        if(foods[i].dead) {
            foods.splice(i,1);
            continue;
        }
        if(foods[i].pregnant && foods.length < 70) {
            foods[i].pregnant = false;
            foods.push(new Food());
        }
    }

    for (var i = 0; i < bodies.length; i++) {
        bodies[i].createforce(bodies,foods);
        bodies[i].checkwall();
        bodies[i].move();
        bodies[i].draw();
        bodies[i].checkdeath();
        bodies[i].checkpregnant();
        if(bodies[i].dead) {
            bodies.splice(i,1);
            continue;
        }
        if(bodies[i].pregnant) {
            bodies[i].pregnant = false;
            bodies.push(new Body());
        }
    }

    fill(0,0,0);
    text("fps: "+frameRate(), 20, 20);
    text("bodies: "+ bodies.length,20,35);
    text("foods: "+ foods.length,20,50);
}