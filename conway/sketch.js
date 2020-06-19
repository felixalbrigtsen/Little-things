var rows = 30
var cols = 30

var cells = []

var scaleVar;
var cellsize;
var margin = 4;

var canvSize = 600;

var runLoop = false;
var showNumbers = false;

function setup() {
    createCanvas(canvSize, canvSize);
    setFrameRate(2);


    //Make 2d array, initialize to 0
    cells = [...Array(rows)].map(x=>Array(cols).fill(0)) 
    nextGenCells = cells

    /*
    scaleVar = (canvSize - (Math.max(rows, cols) * margin)) / Math.max(rows, cols);
    cellsize = scaleVar - margin; */

    scaleVar = canvSize / Math.max(rows, cols);
    cellsize = scaleVar - margin;
}

function countNeighbors(x, y) {
    var livingCount = 0;
    for (var i = -1; i < 2; i++){       //Left, same X, Right
       for (var j = -1; j < 2; j++){    //Top, same Y, Bottom

            if (x+i >= 0 && x+i < cols && y+j >= 0 && y+j < rows){ //Don't try to check any cells off the edge
                livingCount += cells[x+i][y+j];
            }
       }
    }
    livingCount -= cells[x][y]; //Don't count itself

    return livingCount;
}

function conwayStep() {
    var futureCells = [...Array(rows)].map(x=>Array(cols).fill(0)) 

    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            var livingNeighbors = countNeighbors(x, y);
            if (cells[x][y] == 1 && livingNeighbors < 2) {
                futureCells[x][y] = 0; //Underpopulation
            } else if (cells[x][y] == 1 && livingNeighbors > 3) {
                futureCells[x][y] = 0; //Overpopulation
            } else if (cells[x][y] == 0 && livingNeighbors == 3) {
                futureCells[x][y] = 1; //Birth
            } else {
                futureCells[x][y] = cells[x][y];
            }
        }
    }
    cells = futureCells;
}

function draw() {
    //Clear screen, fill with teal
    background(0,100,100);

    //Draw each cell
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {

            if (cells[i][j]) { //Color depends on state
                fill(200);
            } else {
                fill(50);
            }
            //Actually draw the cell
            rect((i*scaleVar + (margin / 2)), (j*scaleVar+ (margin / 2)), cellsize, cellsize);
            //Display the number of neighbors, debugging
            fill(255, 255, 0);
            if (showNumbers) {
                text(countNeighbors(i,j), i*scaleVar + 7, j*scaleVar + 15);
            }
        }
    }

    if (runLoop){ //Only update if runloop is true, but draw anyways
        //Update the cells
        conwayStep();
    }
}

function mouseClicked() {
    var x, y;
    if (mouseX > 0 || mouseY > 0 || mouseX < width-1 || mouseY < height-1) { //Only count clicks inside the canvas
        x = Math.floor(mouseX / (scaleVar));
        y = Math.floor(mouseY / (scaleVar));
        cells[x][y] = !cells[x][y]
    }
}