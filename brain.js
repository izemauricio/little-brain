class NeuralNetwork {
    constructor(in_nodes, hid_nodes, out_nodes) {
        this.input_nodes = in_nodes;
        this.hidden_nodes = hid_nodes;
        this.output_nodes = out_nodes;

        // matrix model
        this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
        this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
        this.weights_ih.randomize();
        this.weights_ho.randomize();

        this.bias_h = new Matrix(this.hidden_nodes, 1);
        this.bias_o = new Matrix(this.output_nodes, 1);
        this.bias_h.randomize();
        this.bias_o.randomize();

        this.learning_rate = 0.1;
        this.activation_function = sigmoid;
    }
}

class ActivationFunction {
constructor(a, b) {
    this.func = a;
    this.dfunc = b;
}
}
let sigmoid = new ActivationFunction(x => 1 / (1 + Math.exp(-x)),y => y * (1 - y));
let tanh = new ActivationFunction(x => Math.tanh(x),y => 1 - (y * y));

class Matrix {
    constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0)); // for each row, create a column array
    }
    randomize() {
        return this.map(e => Math.random() * 2 - 1);
    }
   
    map(f) {
        // Apply new_val = function(old_val,i,j) to every element (i,j) of matrix
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
            let val = this.data[i][j];
            this.data[i][j] = f(val, i, j);
            }
        }
        return this;
    }
}