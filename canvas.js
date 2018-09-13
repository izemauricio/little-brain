var foodLimit = 70;
var bodyLimit = 500;
var bodies = [];
var foods = [];
var bullets = [];
var number_of_bodies = 1;
var number_of_foods = 10;
var debug;

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
    background(20);

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
      strokeWeight(1);

      stroke(0);
      fill(0);
      
      rect(0,0,105,90);

      stroke(255,250,255);
      noFill();
      
      text("FPS: "+frameRate().toFixed(0), 20, 20);
      text("BODIES: "+ bodies.length,20,40);
      text("FOODS: "+ foods.length,20,60);
      text("BULLETS: "+ bullets.length,20,80);
    }

}

// Add new vehicles by dragging mouse
function mouseClicked() {
  bodies.push(new Body(mouseX, mouseY));
}
