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
var number_of_bodies = 5;
var number_of_foods = 50;

var debug;


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
        bodies[i] = new Body(random(0,width), random(0,height));
    }

    debug = select('#debug');
}

function draw() {
    background(190);

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
      fill(0,0,0);
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
