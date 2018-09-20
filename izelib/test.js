// adapted from Toy-Neural-Network-JS
let nn;
let lr_slider;

// xor
let training_data = [{
    inputs: [0, 0],
    outputs: [0]
},
{
    inputs: [0, 1],
    outputs: [1]
},
{
    inputs: [1, 0],
    outputs: [1]
},
{
    inputs: [1, 1],
    outputs: [0]
}
];

function setup() {
    console.log("hi from p5");
    var mycanvas = createCanvas(400, 400);
    mycanvas.parent('mycanvas');
    nn = new Neural(2, 4, 1);
    
    lr_slider = createSlider(0.01, 0.5, 0.1, 0.01);
}

function draw() {
    //frameRate(1);

    background(0);

    for (let i = 0; i < 10; i++) {
        let data = random(training_data);
        nn.train(data.inputs, data.outputs);
        //console.log("nn = " + nn.print());
    }

    nn.learningrate = lr_slider.value();

    let resolution = 10;
    let cols = width / resolution;
    let rows = height / resolution;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x1 = i / cols;
            let x2 = j / rows;
            let inputs = [x1, x2];
            let y = nn.predict(inputs);
            noStroke();
            fill(y * 255);
            rect(i * resolution, j * resolution, resolution, resolution);
        }
    }
}