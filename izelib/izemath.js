// adapted from Toy-Neural-Network-JS
class IzeMatrix {
    constructor(rows, cols) {
        // model variables
        this.rows = rows;
        this.cols = cols;
        this.data = [];

        // inicia com zero
        for (let i=0; i<this.rows; i++) {
            this.data[i] = [];
            for (let j=0; j<this.cols; j++) {
                this.data[i][j] = 0;
            }
        }
        // using arrow-function: this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }
    // print
    print() {
        // console.table(this.data);
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.cols; j++) {
                console.log("(i,j) = " + this.data[i][j] + "\n");
            }
        }
    }
    // return a new matrix m with the same elements of this.matrix
    copy() {
        let m = new IzeMatrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                m.data[i][j] = this.data[i][j];
            }
        }
        return m;
    }
    // generate a row-matrix from the input-array-values
    static fromArray(arr) {
        return new IzeMatrix(arr.length,1).map((e, i, j) => arr[i]); // pode apenas ignorar o terceiro argumento
    }
    // to array
    toArray() {
        let arr = [];
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.cols; j++) {
                arr.push(this.data[i][j]);
            }
        }
        return arr; // retorna copia local? nao vai deixar de existir apos return?
    }
    // generate random numbers for each element of matrix - pode ter sobrecarga de metodo em js?
    randomize(min,max) {
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.cols; j++) {
                this.data[i][j] = Math.random() * (max - min) + min;
            }
        }
    }
    // apply a function f(val,i,j) to every element of matrix
    map(f) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = f(val, i, j);
            }
        }
        return this;
    }
    static transpose(m) {
        return new IzeMatrix(m.cols, m.rows).map((v, i, j) => m.data[j][i]);
    }
    // scalar sum
    addscalar(n) {
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.cols; j++) {
                this.data[i][j] += n;
            }
        }
        // this.map((v, i, j) => v + m.data[i][j]);
        // this.map(function(v,i,j) = {v + m.data[i][j]})
    }
    // matrix sum
    addmatrix(n) {
        if (this.rows !== n.rows || this.cols !== n.cols) {
            console.log('ERROR: A.rows and B.rows || A.cols and B.cols must match.');
            return;
        }
        return this.map((v, i, j) => v + n.data[i][j]);
    }
    // scalar sub
    sub(n) {
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.cols; j++) {
                this.data[i][j] -= n;
            }
        }
        // this.map((v, i, j) => v + m.data[i][j]);
        // this.map(function(v,i,j) = {v + m.data[i][j]})
    }
    static sub(a, b) {
        if (a.rows !== b.rows || a.cols !== b.cols) {
          console.log('Columns and Rows of A must match Columns and Rows of B.');
          return;
        }

        // Return a new Matrix a-b
        return new IzeMatrix(a.rows, a.cols)
          .map((_, i, j) => a.data[i][j] - b.data[i][j]);
      }
    // return a new matrix as result of old matrix multiplicated by f(val of old,i-old,j-old)
    static map(matrix, f) {
        return new IzeMatrix(matrix.rows, matrix.cols).map((e, i, j) => f(matrix.data[i][j], i, j));
    }
    // matrix sum
    sum(m) {

    }
    // scalar subtraction
    // scalar product
    scalarprod(n) {
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.cols; j++) {
                this.data[i][j] = this.data[i][j] * n;
            }
        }
    }
    // matrix product (return a new matrix) (dot product in each element)
    static matrixprod(a, b) {
        if (a instanceof IzeMatrix && b instanceof IzeMatrix) {
            if (a.cols == b.rows) {
                return new IzeMatrix(a.rows,b.cols)
                .map((e, i, j) => {
                    let sum = 0;
                    for (let k = 0; k < a.cols; k++) {
                        sum += a.data[i][k] * b.data[k][j];
                    }
                    return sum;
                });

            }
        }
    }
    // hadamad product
    hadamardprod(n) {
        if (this.rows == n.rows || this.cols == n.cols) {
            this.map((v,i,j) => (v * n.data[i][j]));
        }
    }
    // dot product
    // cross product
}
