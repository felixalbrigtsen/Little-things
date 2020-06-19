let nodes = [];
const cols = 20;
const rows = 20;
const scl = 20;
const padding = 2;

let source = [undefined, undefined];
let target = [undefined, undefined];

let gstate = 2;

//A* specific:
let open = [];
let closed = [];

/*
Global state:
0: Pathfinding, normal operation
1: Finished, do nothing
2: Placing source
3: Placing target
*/

/*
Node state:
0: unhandled, black
1: "open", green
2: "closed", red
3: finished path, blue
4: Source/target, white
5: Wall/impossible to cross, purple
*/

function findCoords(index) {
    let x = index % cols;
    let y = (index - x) / cols;
    return [x, y];
}
function findIndex(x, y) {
    return (y*cols)+x;
}

function setup() {
    //Initialize nodes
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            nodes.push({
                "x": x,
                "y": y,
                "index": (y*cols)+x,
                "state": 0,
                "parent": undefined,
                d_source: 10000000000, //Should be infinite
                d_target: undefined,
                score:  undefined
            });
        }
    }
    
    //Make a "wall" for testing
    for (let i = 85; i < 95; i++) {
        nodes[i].state = 5;
    }
    
    createCanvas(cols * (scl + padding) + padding, rows * (scl + padding) + padding);
    drawNodes();
    
    console.log("Click source, then click target");
    
}

function drawNodes() {
    nodes.forEach((node, index) => {
        let x, y;
        [x, y] = findCoords(index);
        
        fill([color(0, 0, 0), color(0, 255, 0), color(255, 0, 0), color(60, 160, 255), color(255, 255, 255), color(255, 0, 255)][node.state]);
        rect(x * (scl + padding) + padding, y * (scl + padding) + padding, scl, scl);
    });
}

mouseClicked = function() {
    let mx = Math.floor((mouseX - padding) / (scl + padding));
    let my = Math.floor((mouseY - padding) / (scl + padding));
    let mi = (my * cols) + mx;
    
    //Set source
    if (gstate == 2) { 
        source = [mx, my];

        //Initialize source node
        nodes[mi].state = 4;
        nodes[mi].parent = mi;
        nodes[mi].d_source = 0;

        //Initialize environment
        gstate = 3;
        open = [findIndex(mx, my)];
        return;
    }
    
    //Set target
    if (gstate == 3) {
        target = [mx, my];
        nodes[mi].state = 4;

        gstate = 0;
        drawNodes();
        
        //Initialize each nodes score and distanec
        for (let i = 0; i < rows*cols; i++) {
            //Find distance to target using pythagoras
            let x, y;
            [x,y] = findCoords(i);

            nodes[i].d_target = Math.round(Math.sqrt(((x - mx) ** 2) + ((y - my) ** 2)) * 10);
            nodes[i].score = nodes[i].d_target + nodes[i].d_source;
        }

        console.log("Distance from source to target: " + nodes[findIndex(...source)].d_target);
        
        
        frameRate(1);
    }
}

function traceRoute(idx) {
    let path = [];
    let current = idx;
    let sourceIndex = findIndex(...source);


    while (current != sourceIndex) {
        current = nodes[current].parent;
        path.push(current);
    }
    
    //Unmark all except correct path
    for (let i = 0; i < rows*cols; i++) {
        if (path.includes(i)) {
            nodes[i].state = 3;
        } else {
            if (nodes[i].state != 5) {    
                nodes[i].state = 0;
            }
        }
    }

    console.log("Found pathlength: " + nodes[idx].d_source);
    return path;
}

function sortOpen(aindex, bindex) {
    a = nodes[aindex];
    b = nodes[bindex];

    //First sort scores
    if (a.score > b.score) { return  1 }
    if (a.score < b.score) { return -1 }
    //Equal scores, consider distance to target
    if (a.d_target > b.d_target) { return  1 }
    if (a.d_target < b.d_target) { return -1 }
    //They are equivalent to each other
    return 0;
}

function stepAStar() {
    open = open.sort(sortOpen);
    let current = open[0];
    if (!current) {
        console.log("No possible cells! quitting.");
        gstate = 1;
    }
    
    //If done
    if (current == findIndex(...target)) {
        console.log("Finished!");
        traceRoute(current);
        gstate = 1;
        return;
    }
    
    //Remove selected item
    open = open.slice(1);

    let currentlength = nodes[current].d_source;
    let testindex = 0;
    let testlength = 0;

    let x = nodes[current].x;
    let y = nodes[current].y;

    //For each neighbor, calculate its pathlength from source (If it is not the parent and the new path is shorter)
    for (let yoffset = -1; yoffset < 2; yoffset++) {
        for (let xoffset = -1; xoffset < 2; xoffset++) {

            let testindex = current + (yoffset*cols) + xoffset;
            //Don't check invalid nodes(outside the map) or yourself
            if ((testindex == current) || (x + xoffset < 0) || (x + xoffset >= cols) || (y + yoffset < 0) || (y + yoffset >= rows)) {
                continue;
            }
            //Don't check walls
            if (nodes[testindex].state == 5) {
                continue;
            }

            if (Math.abs(xoffset) + Math.abs(yoffset) > 1) { //If its a diagonal
                testlength = currentlength + 14;
            } else { //If its orthogonal / edge
                testlength = currentlength + 10;
            }
            //If the new path to this neighbor is shorter, change it and add it to open
            if (testlength < nodes[testindex].d_source) {
                nodes[testindex].parent = current;
                nodes[testindex].d_source = testlength;
                nodes[testindex].score = nodes[testindex].d_source + nodes[testindex].d_target;
                if (!open.includes(testindex)) { open.push(testindex) }
            }
        }
    }
    

    for (let i = 0; i < open.length; i++) {
        nodes[open[i]].state = 1;
    }
    nodes[current].state = 2;
}

function draw() {
    background(128);
    
    switch (gstate) {
        case 0:
        //Do pathfinding
        stepAStar();
        break;
        case 1:
        //Stop
        noLoop();
        break;
        default:
        //Do nothing
        break;
    }
    
    drawNodes();
}