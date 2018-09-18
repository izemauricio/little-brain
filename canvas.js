var foodLimit = 70;
var bodyLimit = 500;
var bodies = [];
var foods = [];
var bullets = [];
var number_of_bodies = 1;
var number_of_foods = 30;
var debug;

let sensor0, sensor1, sensor2, sensor3, sensor4, sensor5, sensor6, sensor7;
let padding_sensor = 15;
let padding_right = 100;

// Slider to speed up simulation
let speedSlider;
let speedSpan;

//Best body so far
let best = null;

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


    output1 = createElement('p','0' );
    output1.position(canvas.width+10+ 1*padding_right ,0*padding_sensor);
    output2 = createElement('p','0' );
    output2.position(canvas.width+10+ 1*padding_right ,1*padding_sensor);

    speedSlider = select('#speedSlider');
    speedSpan = select('#speed');

}

function draw() {
    background(20);

    // How fast should we speed up
    let cycles = speedSlider.value();
    speedSpan.html(cycles);

    for(var j = 0 ; j < cycles ; j++){
      if (random(1,100) > 98 && foods.length < 30) {
          foods.push(new Food());
      }

      //  BULLETS
  //    for (var i = 0; i < bullets.length; i++) {
      //    bullets[i].toBehave(i);
    //  }

      // FOODS
      for (var i = foods.length-1; i >= 0; i--) {
          foods[i].toBehave(i);
      }

      // ANIMALS
      let record = -1;
      for (var i = bodies.length-1; i >= 0; i--) {
          if(bodies[i].isDead()){
            bodies.splice(i,1);
            continue;
          }
          let aBody = bodies[i];
          aBody.toBehave(i);
          if (aBody.score > record) {
            record = aBody.score;
            best = aBody;
          }
      }

      // If there is less than 20 apply reproduction
      if (bodies.length < 20) {
        for (let b of bodies) {
          // Every vehicle has a chance of cloning itself according to score
          // Argument to "clone" is probability
          let newVehicle = b.reproduce(0.1 * b.score / record);
          // If there is a child
          if (newVehicle != null) {
            bodies.push(newVehicle);
          }
        }
      }
  }

  for (var i = bodies.length-1; i >= 0; i--) {
      bodies[i].draw();
  }

  for (var i = foods.length-1; i >= 0; i--) {
      foods[i].draw();
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


  //  output1.html("output1: " + (bodies[0].outputDebug[0]*2 -1) );
    //output2.html("output2: " + (bodies[0].outputDebug[1]*2  -1) );

    //output1.html("output1: " + bodies[0].output[0]);
    //output2.html("output2: " + bodies[0].output[1]);

  //  stroke(255,255,0);
//    noFill();
  //  line(bodies[0].position.x,bodies[0].position.y,
    //  bodies[0].position.x+ bodies[0].output[0]*20,bodies[0].position.y + bodies[0].output[1]*20);
      //line(bodies[0].position.x,bodies[0].position.y,
      //  bodies[0].position.x+ (bodies[0].outputDebug[0]*2 -1),bodies[0].position.y + (bodies[0].outputDebug[1]*2  -1));

}

function circleWorld(obj){
  if(obj.position.x <0){
    obj.position.x = width - obj.position.x*-1
  }

    if(obj.position.x >width){
      obj.position.x = (obj.position.x-width)
    }

    if(obj.position.y <0){
      obj.position.y = height - obj.position.y*-1
    }

    if(obj.position.y >height){
      obj.position.y = (obj.position.y-height)
    }
}

// Add new vehicles by dragging mouse
function mouseClicked() {
  //bodies.push(new Body(mouseX, mouseY));
}
