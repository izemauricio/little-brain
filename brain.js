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

class Matrix {
    constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0)); // for each row, create a column array
    }
}