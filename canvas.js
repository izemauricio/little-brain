/*
IDEAS

1. dna should tell: how fast, how strong, the gun power, the capacity-of-reading-food-toxity (0 to 1), vision power, etc
2. we need find a equilibrium between # of death and # of birth
3.

*/


var foodLimit = 70;
var bodyLimit = 500;
var bodies = [];
var foods = [];
var bullets = [];
var number_of_bodies = 1;
var number_of_foods = 10;

var debug;

 // body sensor setup

 // How many sensors does each vehicle have?
var totalSensors = 2;
// How far can each vehicle see?
var sensorLength = 150;
// What's the angle in between sensors
var sensorAngle = (Math.PI * 2) / totalSensors;


function setup() {

    frameRate(60);
    angleMode(RADIANS);
    var mycanvas = createCanvas(1200, 600);
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
        bodies[i] = new Body(random(0,width), random(0,height));
    }

    debug = select('#debug');
}

function draw() {
    background(0);

    if (random(1,100) > 98 && foods.length < 30) {
        foods.push(new Food());
    }

    //  BULLETS
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].toBehave(i);
    }

    // FOODS
    for (var i = foods.length-1; i >= 0; i--) {
        foods[i].toBehave(i);
    }

    // ANIMALS
    for (var i = bodies.length-1; i >= 0; i--) {
        bodies[i].toBehave(i);
    }


    if(debug.checked()){
      fill(255,0,0);
      stroke(255,0,0);
      text("fps: "+frameRate(), 20, 20);
      text("bodies: "+ bodies.length,20,35);
      text("foods: "+ foods.length,20,50);
      text("bullets: "+ bullets.length,20,65);
    }

}

// Add new vehicles by dragging mouse
function mouseClicked() {
  bodies.push(new Body(mouseX, mouseY));
}
