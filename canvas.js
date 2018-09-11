var x = 0;
var y = 0;
var bodies = [];
var foods = [];

function setup() {
    //createCanvas(1000, 1000);
    var mycanvas = createCanvas(1000, 600);
    mycanvas.parent('mycanvas');
    
    noFill();
    stroke(0);
    strokeWeight(1);

    //drawingContext.shadowOffsetX = 5;
    //drawingContext.shadowOffsetY = -5;
    //drawingContext.shadowBlur = 10;
    //drawingContext.shadowColor = "black";

    for (var i = 0; i < 25; i++) {
        foods[i] = new Food();
    }
    for (var i = 0; i < 2; i++) {
        bodies[i] = new Body();
    }
 
}

function draw() {
    background(200);

    text("fps: "+frameRate(), 30,30);

    ellipse(x, y, 80, 80);

    for (var i = 0; i < foods.length; i++) {
        foods[i].move();
        foods[i].display();
        if (foods[i].energy <= 0) {
            foods.splice(i,1);
        }
        else if (foods[i].energy > 500) {
            foods.push(new Body());
        }
    }

    for (var i = 0; i < bodies.length; i++) {
        bodies[i].doforce(bodies,foods);
        bodies[i].checkwall();
        bodies[i].move();
        bodies[i].draw();
        if (bodies[i].energy <= 0) {
            bodies.splice(i,1);
        }
        else if (bodies[i].energy > 500 && bodies[i].age > 100) {
            bodies.push(new Body());
        }
    }

    text("bodies: "+bodies.length,50,50);

    //fill(200,50,8);
    //ellipse(50,50,20,20);
}


