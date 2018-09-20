// how many objects should the simulation start with
var number_of_bodies = 1;
var number_of_foods = 30;

// maximum of objects allowed in this simulation
var foodLimit = 70;
var bodyLimit = 500;

// all objects
var bodies = [];
var foods = [];
var bullets = [];

// show debug information?
var debug;

// keep track of the best body so far
var bestbody = null;
var record = -1;
var slider;

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
  slider = createSlider(0.01, 0.5, 0.1, 0.01);
}

function draw() {
  // BEHAVE
  behaveEverything();

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

  // BODY
  // keep population
  //if (bestbody != null && bestbody.brain !== undefined) {bodies.push(bestbody.clone()); console.log("cloned:"); console.log(bestbody);} else {bodies.push(new Body(100,100));}
  for (var i = bodies.length - 1; i >= 0; i--) {
    // remover?
    if (bodies[i].isDead()) {
      bodies.splice(i, 1);
      continue;
    }
    // adicionar?
    if (bodies[i].isPregnant()) {
    }
    // behave!
    bodies[i].behave(i);

    // jogos ferozes! - keep track of the best body
    if (bodies[i].score > record) {
      record = bodies[i].score;
      bestbody = bodies[i];
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
  push();
  strokeWeight(0);
  stroke(255, 0, 255);
  fill(255, 0, 0);
  text("FPS: " + frameRate().toFixed(0), 20, 20);
  text("BODIES: " + bodies.length, 20, 40);
  text("FOODS: " + foods.length, 20, 60);
  text("BULLETS: " + bullets.length, 20, 80);
  pop();
}

function drawBackground() {
  background(20);
}

function mouseClicked() {
  console.log(bestbody);
  bodies.push(bestbody.clone());
}