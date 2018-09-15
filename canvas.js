var foodLimit = 70;
var bodyLimit = 500;
var bodies = [];
var foods = [];
var bullets = [];
var number_of_bodies = 1;
var number_of_foods = 10;
var debug;

let sensor0, sensor1, sensor2, sensor3, sensor4, sensor5, sensor6, sensor7;
let padding_sensor = 15;
let padding_right = 100;


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

    sensor0 = createElement('p','0' );
    sensor0.position(canvas.width+10,0*padding_sensor);
    sensor1 = createElement('p','0' );
    sensor1.position(canvas.width+10,1*padding_sensor);

    sensor2 = createElement('p','0' );
    sensor2.position(canvas.width+10,2*padding_sensor);
    sensor3 = createElement('p','0' );
    sensor3.position(canvas.width+10,3*padding_sensor);

    sensor4 = createElement('p','0' );
    sensor4.position(canvas.width+10,4*padding_sensor);
    sensor5 = createElement('p','0' );
    sensor5.position(canvas.width+10,5*padding_sensor);

    sensor6 = createElement('p','0' );
    sensor6.position(canvas.width+10,6*padding_sensor);
    sensor7 = createElement('p','0' );
    sensor7.position(canvas.width+10,7*padding_sensor);

    output1 = createElement('p','0' );
    output1.position(canvas.width+10+ 1*padding_right ,0*padding_sensor);
    output2 = createElement('p','0' );
    output2.position(canvas.width+10+ 1*padding_right ,1*padding_sensor);


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

    sensor0.html("sensor_0: "  );
    sensor1.html("sensor_1: "  );
    sensor2.html("sensor_2: "  );
    sensor3.html("sensor_3: "  );
    sensor4.html("sensor_4: "  );
    sensor5.html("sensor_5: "  );
    sensor6.html("sensor_6: "  );
    sensor7.html("sensor_7: "  );

    output1.html("output1: " + bodies[0].output[0] );
    output2.html("output2: " + bodies[0].output[1] );

    stroke(255,255,0);
    noFill();
    line(bodies[0].position.x,bodies[0].position.y,
      bodies[0].position.x+ bodies[0].output[0]*200,bodies[0].position.y + bodies[0].output[1]*200);

}

// Add new vehicles by dragging mouse
function mouseClicked() {
  //bodies.push(new Body(mouseX, mouseY));
}
