var pipeMargin = 200; //Distance between the edge of the screen and highest/lowest position of pipes
var pipeGap = 150;
var pipeWidth = 50;
var pipeSpeed = 2;

var birdSize = 20;
var birdx = 200;

var gravity = 0.5;
var maxSpeed = 20;

var score = 0;
var highScore = 0;

function setup() {
	var canv = createCanvas(500, 750);
	canv.parent("sketchContainer");
	background(50, 150, 255);
	bird = new Bird();
	obst1 = new Pipe();
	obst2 = new Pipe();
	obst2.x = width * 1.5;
}

function draw() {
	background(50, 150, 255);
	strokeWeight(1);
	obst1.draw();
	obst2.draw();
	bird.draw();
}

function Bird() {
	this.x = birdx;
	this.y = height / 3;
	this.speed = 3

	this.draw = function(){
		this.speed += gravity; //Accellerate with gravity
		//Clamp speed
		if (this.speed > maxSpeed){ this.speed = 10; }
		if (this.speed < -maxSpeed) {this.speed = -19; }
		this.y += this.speed;

		if (this.y > height) { crash(); }
		strokeWeight(2);
		fill(255, 255, 0);
		ellipse(this.x, this.y, birdSize, birdSize);
	}
}

function Pipe() {
	this.x = width;
	this.y = (Math.floor(Math.random() * (height - (2 * pipeMargin)))) + pipeMargin;

	this.passed = false;

	this.draw = function(){
		this.x -= pipeSpeed;
		if (this.x < -pipeWidth) { //If the pipe is to the left of the viewable screen, reset it to the very right
			this.x = width;
			this.y = (Math.floor(Math.random() * (height - (2 * pipeMargin)))) + pipeMargin;
			this.passed = false;
		}
		if ((this.x < bird.x + (birdSize / 2)) && (this.x + pipeWidth > bird.x - (birdSize / 2))) { //If the bird is within the X direction of the pipe
			if ((bird.y - (birdSize / 2) < this.y - (pipeGap / 2)) || ((bird.y + (birdSize / 2) > this.y + (pipeGap / 2)))) { //If the bird is within the Y direction of top OR bottom pipe
				crash();
			} else if (!this.passed) { //Add to the score every time you pass a pipe, but only count it once
				this.passed = true;
				score += 1;
				highScore = Math.max(score, highScore); //Change the high score if score is larger than previous high

				document.getElementById("scoreLabel").innerHTML = score; //Display the score
				document.getElementById("highScoreLabel").innerHTML = highScore; //Display the high score
			}
		}

		fill(50, 255, 50);
		rect(this.x, -1, pipeWidth, (this.y - (pipeGap / 2))); //Draw top pipe (Use -1 to avoid stroke)
		rect(this.x, (this.y + (pipeGap / 2)), pipeWidth, height); //Draw bottom pipe
	}
}

function keyTyped() { //Jump when space is pressed, by setting velocity upwards
	if (key == " ") {
		bird.speed = -10;
	}
}

function mouseClicked() { //Jump when mouse is clicked 
	bird.speed = -10;
}

function crash() {
	bird.y = height / 3;
	bird.speed = -5
	score = 0;
	document.getElementById("scoreLabel").innerHTML = score; //Show the score
}