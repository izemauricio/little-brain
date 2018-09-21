// how many objects should the simulation start with
var number_of_bodies = 1;
var number_of_foods = 30;

// maximum of objects allowed in this simulation
var foodLimit = 70;
var bodyLimit = 5;

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
var record = -1;

//Padding
const STATUS_PADDING = 17;
const FOOD_PADDING = 50;

function setup() {
  // world setup
  var mycanvas = createCanvas(1200, 600);
  mycanvas.parent('mycanvas');
  frameRate(60);
  angleMode(RADIANS);

  // create foods
  for (var i = 0; i < number_of_foods; i++) {
    foods[i] = new Food();
  }

  // create bodies
  for (var i = 0; i < number_of_bodies; i++) {
    bodies[i] = new Body(random(0, width), random(0, height));
  }

  // get debug mode from user html dom object
  debug = select('#debug');

  // create dom object from this js
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
}

function draw() {
  // How fast should we speed up
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  //How many updates the objs before draw.
  for(var i = 0 ; i < cycles; i++){
    // BEHAVE
    behaveEverything();
  }

  // DRAW
  drawEverything();
}

function behaveEverything() {
  // FOOD
  // keep food population
  if (foods.length < 30) {
    foods.push(new Food());
    return;
  }
  for (var i = foods.length - 1; i >= 0; i--) {
    foods[i].behave(i);
  }

  //Best record from the cycle
  var recordCycle = -1;
  // BODY
  // keep population
  //if (bestbody != null && bestbody.brain !== undefined) {bodies.push(bestbody.clone()); console.log("cloned:"); console.log(bestbody);} else {bodies.push(new Body(100,100));}
  for (var i = bodies.length - 1; i >= 0; i--) {
    // remover?
    if (bodies[i].isDead()) {
      bodies.splice(i, 1);
      continue;
    }

    // behave!
    bodies[i].behave(i);

    // jogos ferozes! - keep track of the best body
    if (bodies[i].score > recordCycle) {
      recordCycle = bodies[i].score;
      bestbody = bodies[i];
    }
  }

  // If there is less than bodyLimit apply reproduction
  if (bodies.length < bodyLimit) {
    for (var i = bodies.length-1; i >=0 ;i-- ) {
      var v = bodies[i];
      // Every body has a chance of cloning itself according to score
      // Argument to "clone" is probability
      var newVehicle = v.clone(0.05 * v.score / recordCycle);
      // If there is a child
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

  // animals
  for (var i = bodies.length - 1; i >= 0; i--) {
    bodies[i].draw();
  }

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
  console.log(bestbody);
  bodies.push(bestbody.clone(mouseX,mouseY));
}
