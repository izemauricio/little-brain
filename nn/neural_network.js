function sigmoidw(x){
//  var res = 1 / (1 + Math.exp(-x));
//  return map(x, 0, 1, -1, 1);

  return 1 / (1 + Math.exp(-x));
}

function reLU(x){
  return x>=0?x:0;
}

function leaky(x){
  return x>=0?x:0.01*x;
}


class NeuralNetworkW{

  constructor(input_nodes, hidden_nodes, output_nodes){

    if(input_nodes instanceof NeuralNetworkW){
      let nn = input_nodes;
      this.input_nodes = nn.input_nodes;
      this.hidden_nodes = nn.hidden_nodes;
      this.output_nodes = nn.output_nodes;

      this.weights_ih = nn.weights_ih.copy();
      this.weights_ho = nn.weights_ho.copy();

      this.bias_h = nn.bias_h.copy();
      this.bias_o = nn.bias_o.copy();


    }else{
      this.input_nodes = input_nodes;
      this.hidden_nodes = hidden_nodes;
      this.output_nodes = output_nodes;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);

      this.weights_ih.randomize();
      this.weights_ho.randomize();

      this.bias_h = new Matrix(this.hidden_nodes,1);
      this.bias_o = new Matrix(this.output_nodes,1);

      this.bias_h.randomize();
      this.bias_o.randomize();
    }

  }


  supletivo(input_array){

    //Generating hidden outputs
    let input = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, input);
    hidden.add(this.bias_h);
    hidden.map(reLU);

    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(leaky);

    return output.toArray();
  }

  clone(){
    return new NeuralNetworkW(this);
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    this.weights_ih.map(func);
    this.weights_ho.map(func);
    this.bias_h.map(func);
    this.bias_o.map(func);
  }


}
