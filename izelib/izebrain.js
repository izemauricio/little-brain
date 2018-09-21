// adapted from Toy-Neural-Network-JS
class Neural {
    constructor(num_input_neurons, num_hidden_neurons, num_output_neurons) {
        //console.log("hi from neural");
        if(num_input_neurons instanceof Neural){
          let nn = num_input_neurons;

          // neural options
          this.learningrate = nn.learningrate;
          this.activation_function = nn.activation_function;

          this.input = nn.input;
          this.hidden = nn.hidden;
          this.output = nn.output;

          this.weights_ih = nn.weights_ih.copy();
          this.weights_ho = nn.weights_ho.copy();

          this.bias_h = nn.bias_h.copy();
          this.bias_o = nn.bias_o.copy();
        }else{
          // neural options
          this.learningrate = 0.1;
          this.activation_function = sigmoid;

          // neural size structure
          this.input = num_input_neurons;
          this.hidden = num_hidden_neurons;
          this.output = num_output_neurons;

          // weight matrix model
          this.weights_ih = new IzeMatrix(this.hidden, this.input);
          this.weights_ho = new IzeMatrix(this.output, this.hidden);

          // random weights values from -1 to 1
          this.weights_ih.randomize(-1,1);
          this.weights_ho.randomize(-1,1);

          // bias matrix model
          this.bias_h = new IzeMatrix(this.hidden, 1);
          this.bias_o = new IzeMatrix(this.output, 1);

          // random bias values from -1 to 1
          this.bias_h.randomize(-1,1);
          this.bias_o.randomize(-1,1);
        }

    }
    mutate() {
        let func = function(v,i,j) {
            if (random(1) < 0.1) {
                let offset = randomGaussian() * 0.5;
                let newx = v + offset;
                return newx;
              } else {
                return v;
              }
        }
        this.weights_ih.map(func);
        this.weights_ho.map(func);
        this.bias_h.map(func);
        this.bias_o.map(func);
    }
    copy() {
        return new Neural(this);
    }
    print() {
        this.weights_ih.print();
    }
    // train the neural network (input_i_am_giving, output_i_want)
    // example: train([0,1],[9,9,9])
    train(input_array, target_array) {

        // 1. SEE HOW IT PREDICTS

        // array input data to row-matrix matrix(input-array-rows,1)
        let input_matrix = IzeMatrix.fromArray(input_array);

        // generate hidden results
        let hidden_result = IzeMatrix.matrixprod(this.weights_ih, input_matrix);

        // apply bias
        hidden_result.addmatrix(this.bias_h);

        // apply activation function
        hidden_result.map(this.activation_function.f);

        // generate output results (matrix product)
        let output_result = IzeMatrix.matrixprod(this.weights_ho, hidden_result);

        // apply bias
        output_result.addmatrix(this.bias_o);

        // apply activation function
        output_result.map(this.activation_function.f);

        // 2. COMPARE OUTPUT WITH DESIRED-OUTPUT

        // desired results as matrix
        let target_matrix = IzeMatrix.fromArray(target_array);

        // see the difference error as target-output
        let target_diff = IzeMatrix.sub(target_matrix, output_result);

        // output_gradients = outputs * (1 - outputs);
        let output_gradient = IzeMatrix.map(output_result, this.activation_function.df);

        // gradient = gradient * output_differences (hadamad product)
        output_gradient.hadamardprod(target_diff);

        // gradient = gradient * learning_rate (changes the amount of change) (scalar product)
        output_gradient.scalarprod(this.learningrate);

        // 3. CALCULATE CORRECTION FROM BACK TO FRONT STARTING WITH HIDDEN-TO-OUTPUT WEIGHTS AND BIAS

        // transpose
        let hidden_results_transpose = IzeMatrix.transpose(hidden_result);

        // deltas
        let weight_ho_deltas = IzeMatrix.matrixprod(output_gradient, hidden_results_transpose);

        // 4. APPLY CORRECTIONS ON HIDDEN-TO-OUTPUT WEIGHTS AND BIAS
        this.weights_ho.addmatrix(weight_ho_deltas);
        this.bias_o.addmatrix(output_gradient);

        // 5. CALCULARE CORRECTIONS FOR INPUT-TO-HIDDEN WEIGHTS AND BIAS

        // transpose operation
        let weights_ho_transpose = IzeMatrix.transpose(this.weights_ho);

        // hidden_differences = weigths * diferences (matrix product)
        let hidden_diff = IzeMatrix.matrixprod(weights_ho_transpose, target_diff);

        // gradients
        let hidden_gradient = IzeMatrix.map(hidden_result, this.activation_function.df);

        // gradient
        hidden_gradient.hadamardprod(hidden_diff);

        // learning rate adjust
        hidden_gradient.scalarprod(this.learningrate);

        // 6. CALCULATE CORRECTIONS FOR INPUT

        // transpose
        let input_transpose = IzeMatrix.transpose(input_matrix);

        // deltas
        let weight_ih_deltas = IzeMatrix.matrixprod(hidden_gradient, input_transpose);

        // 7. APPLY CORRECTION TO INPUT-TO-HIDDEN WEIGHTS

        this.weights_ih.addmatrix(weight_ih_deltas);
        this.bias_h.addmatrix(hidden_gradient);

        // 8. REPEAT
    }
    predict(input_array) {
        let input_matrix = IzeMatrix.fromArray(input_array);

        let hidden_result = IzeMatrix.matrixprod(this.weights_ih, input_matrix);

        hidden_result.addmatrix(this.bias_h);

        hidden_result.map(this.activation_function.f);

        let output_result = IzeMatrix.matrixprod(this.weights_ho, hidden_result);

        output_result.addmatrix(this.bias_o);

        output_result.map(this.activation_function.f);

        return output_result.toArray();
    }
}

class ActivationFunction {
    constructor(a, b) {
        this.f = a;
        this.df = b;
    }
}

let sigmoid = new ActivationFunction(x => 1 / (1 + Math.exp(-x)), y => y * (1 - y));
let tanh = new ActivationFunction(x => Math.tanh(x), y => 1 - (y * y));
