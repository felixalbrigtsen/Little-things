//Felix Albrigtsen July 2019

/*

Important notes:

-SuperChip and Megachip is NOT compatible with this "emulator"
-There is no sound
-There is a mysterious rendering error when trying to draw superchip roms and some other roms


*/

var pxScale = 10;
var color1 = 0;
var color2 = [0, 255, 0];

var canvWidth = 64;
var canvHeight = 32;

var memorySize = 0x1000;

var frame = new Array();

var timerInterval;


function setup() {
    var myCanvas = createCanvas(canvWidth*pxScale, canvHeight*pxScale);
    myCanvas.parent("canvasDiv");

    frameRate(60);

    displayRoms();

    //Set colors to color2 on color1 background
    background(color1);
    fill(color2);
    noStroke();

    //New vm object
    myChip8 = new Chip8;
    myChip8.reset();

    timerInterval = setInterval(myChip8.handleTimers(), 1000);
}

function draw() {
    if (myChip8.running) {
        myChip8.emulateCycle(); //Do one step of the processor
        if (myChip8.updateScreen) { //If the update flag is set, then update the screen buffer
            frame = myChip8.display;
            myChip8.updateScreen = false;
        }
    }

    showKeypad();
    drawFrame();
}

function drawFrame() {
    background(color1); //Clear
    var x = 0;
    var y = 0;

    fill(color2);

    for (var i = 0; i < frame.length; i++) {
        if (frame[i] > 0) {
            x = i % canvWidth;
            y = (i - x) / canvWidth;

            square(x*pxScale, y*pxScale, pxScale);
        }
        

    }
}



/* TODO

- Fix screen glitching
- Make sound

*/