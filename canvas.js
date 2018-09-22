// how many objects should the simulation start with
var number_of_bodies = 1;
var number_of_foods = 30;

// maximum of objects allowed in this simulation
var foodLimit = 70;
var bodyLimit = 1;

// all objects
var bodies = [];
var foods = [];
var bullets = [];

// show debug information?
var debug;

// Slider to speed up simulation
let speedSlider;
let speedSpan;

// keep track of the best body so far
var bestbody = null;


//Padding
const STATUS_PADDING = 20;
const FOOD_PADDING = 50;

function setup() {
  // world setup
  var mycanvas = createCanvas(800, 600);
  mycanvas.parent('mycanvas');
  //frameRate(60);
  angleMode(RADIANS);

  // get debug mode from user html dom object
  debug = select('#debug');

  // create dom object from this js
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');

  // create foods
  for (let i = 0; i < number_of_foods; i++) {
    foods[i] = new Food();
  }

  // create bodies
  for (let i = 0; i < number_of_bodies; i++) {
    bodies[i] = new Body(random(0, width), random(0, height));
  }
}

function draw() {
  // How fast should we speed up
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  // how many updates the objs before draw.
  for(var i = 0 ; i < cycles; i++){
    // BEHAVE
    behaveEverything();
  }

  // DRAW
  drawEverything();
}

function behaveEverything() {

  // keep food population
  if (foods.length < 30) {
    foods.push(new Food());
    return;
  }

  // food behave
  for (var i = foods.length - 1; i >= 0; i--) {
    foods[i].behave(i);
  }

  // remove dead bodies
  for (var i = bodies.length - 1; i >= 0; i--) {
    if (bodies[i].isDead()) {
      bodies.splice(i, 1);
      continue;
    }
  }

  // select the best body score
  var recordCycle = -1;
  for (var i = bodies.length - 1; i >= 0; i--) {
    if (bodies[i].score > recordCycle) {
    recordCycle = bodies[i].score;
    bestbody = bodies[i];
    }
  }
  push();
  fill(255);
  text("RECORD: " + recordCycle, 0, 0);
  pop();

  // body behave
  for (var i = bodies.length - 1; i >= 0; i--) {
    bodies[i].behave(i);
  }

  // if less than 20, try to do reproduction on every body
  if (bodies.length < 10) {
    for (var i = bodies.length-1; i >=0 ;i-- ) {
      var v = bodies[i];
      
      // flip coins to see if it can clone itself %5 * body-score/record-score
      var newVehicle = v.clone(0.05 * v.score / recordCycle);

      // if yes
      if (newVehicle && newVehicle != null) {
        bodies.push(newVehicle);
      }
    }
  }

  // bullet behave
  /*
  for (var i = 0; i < bullets.length; i++) {
  bullets[i].toBehave(i);
  }
  */
}

function drawEverything() {
  // background
  drawBackground();

  // foods
  for (var i = foods.length - 1; i >= 0; i--) {
    foods[i].draw();
  }

  // bodies
  for (var i = bodies.length - 1; i >= 0; i--) {
    bodies[i].draw();
  }

  // highligh the bestbody
  bestbody.drawHighlight();

  // bullets

  // stats
  if (debug.checked()) {
    drawStats();
  }

  
}

function drawStats() {
  var numbTexts = 1;
  push();
  strokeWeight(0);
  stroke(255, 0, 255);
  fill(255, 0, 0);
  textSize(18);
  text("FPS: " + frameRate().toFixed(0), 20, STATUS_PADDING*numbTexts++);
  text("BODIES: " + bodies.length, 20, STATUS_PADDING*numbTexts++);
  text("FOODS: " + foods.length, 20, STATUS_PADDING*numbTexts++);
  text("BULLETS: " + bullets.length, 20, STATUS_PADDING*numbTexts++);
  text("SCORE: " + bestbody.score, 20, STATUS_PADDING*numbTexts++);
  
  text("GENERATION: " + bestbody.generation, 20, STATUS_PADDING*numbTexts++);
  pop();
}

function drawBackground() {
  background(20);
}

function mouseClicked() {
  //console.log(bestbody);
  //var einstein = NeuralNetwork.deserialize(bestOne);
  //bodies.push(bestbody.clone(mouseX,mouseY));
  //bodies.push(new Body(width/2,height/2, einstein));
}
