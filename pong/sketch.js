const paddleOffset = 50;
const paddleWidth = 16;
const paddleHeight = 120;
const paddleSpeed = 2;
const ballSpeed = 6;//Must be lower than paddleWidth
const ballSize = 30;
const maxBounceAngle = 5 * Math.PI / 12 //Max angle to bounce off paddle. In radians. This is equivalent to 75 degrees.

var kbControl = false;

var score_Player = 0;
var score_Computer = 0;

//Prevent scrolling from keyboard use.

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function setup(){
	Ball = new ballClass();

	rPaddle = new PaddleClass(true);
	lPaddle = new PaddleClass(false);

	createCanvas(windowWidth-10, 450);
}

function draw(){
	clear();
	background(50);

	rPaddle.update();
	lPaddle.update();
	rPaddle.show();
	lPaddle.show();

	Ball.update();
	Ball.show();
}

var ballClass = function(){
	////this.x = windowWidth / 2;
	this.x = width / 2;
	this.y = height / 2;

	this.xVel = ballSpeed;
	this.yVel = 3;
	console.log(paddleOffset);
	console.log(paddleOffset + paddleWidth);

	this.death= function(){
		if (this.x < 0){
			score_Computer += 1;
			document.getElementById("ComputerScore").innerHTML = score_Computer;
		} else if (this.x > width){
			score_Player += 1;
			document.getElementById("PlayerScore").innerHTML = score_Player;
		}

		this.x = width / 2;
		this.y = height / 2;

		this.yVel = 0;
		this.xVel = ballSpeed;
	}

	this.update = function(){
		this.x += this.xVel;
		this.y += this.yVel;

		if (this.y - ballSize / 2 < 0 || this.y + ballSize / 2 > height){
			this.yVel *= -1;
		}

		//Bounce of left paddle
		if (this.x - ballSize/2 > lPaddle.x && this.x - ballSize/2 <= lPaddle.x + paddleWidth) { //If width is within left paddle
			if (this.y > lPaddle.y - paddleHeight/2 && this.y < lPaddle.y + paddleHeight/2) { //If height is within left paddle
				var relativeY = this.y - lPaddle.y; //Height of ball compared to height of paddle. Center of paddle = 0
				relativeY /= paddleHeight / 2 //Normalize relativeY. Value is now between -1 and 1, instead of half paddleHeight or -60 - 60
				var bounceAngle = relativeY * -maxBounceAngle //Multiply normalized value with max angle(Radians)

				//Calculate x and y speeds from angle
				this.xVel = ballSpeed * Math.cos(bounceAngle);
				this.yVel = ballSpeed * - Math.sin(bounceAngle);
				this.x += ballSpeed; //Avoid "rebouncing" with several collisions by pushing out of the paddle
			}
		}

		//Bounce of right paddle
		if (this.x + ballSize/2 < rPaddle.x + paddleWidth && this.x + ballSize/2 >= rPaddle.x) { //If width is within left paddle
			if (this.y > rPaddle.y - paddleHeight/2 && this.y < rPaddle.y + paddleHeight/2) { //If height is within left paddle
				var relativeY = this.y - rPaddle.y; //Height of ball compared to height of paddle. Center of paddle = 0
				relativeY /= paddleHeight / 2 //Normalize relativeY. Value is now between -1 and 1, instead of half paddleHeight or -60 - 60
				var bounceAngle = relativeY * -maxBounceAngle //Multiply normalized value with max angle(Radians)

				//Calculate x and y speeds from angle
				this.xVel = ballSpeed * - Math.cos(bounceAngle);
				this.yVel = ballSpeed * - Math.sin(bounceAngle);
				this.x -= ballSpeed; //Avoid "rebouncing" with several collisions by pushing out of the paddle
			}
		}

		if (this.x < 0 || this.x > width){
			this.death();
		}
	}

	this.show = function(){
		noStroke()
		fill(200);
		ellipse(this.x, this.y, ballSize);
	}
}

var PaddleClass = function(aiControl){
	if (aiControl) {
		this.x = windowWidth - 10 - paddleOffset - paddleWidth / 2;
		//this.x = width - paddleOffset - paddleWidth;                 //SUPER WEIRD BUG?!?!?!
	} else {
		this.x = paddleOffset;
	}
	//Start out the paddle in the center of the screen
	this.y = height / 2;

	this.update = function(){
		if (aiControl) { //"Chase" the ball at paddleSpeed speed.
			if (Ball.y > this.y + 4) { //(The +4 is to prevent alternating between being above and below the ball)
				this.y += paddleSpeed;
			} else  if (Ball.y < this.y - 4){
				this.y -= paddleSpeed;
			}
		} else {
			if (!kbControl) {
				//Center of paddle is on height with the mouse
				this.y = mouseY;
			} else {
				if (keyIsDown(UP_ARROW)) {
					this.y -= paddleSpeed;
				} else if (keyIsDown(DOWN_ARROW)) {
					this.y += paddleSpeed;
				}
			}
		}

		//Make sure the paddle doesn't go over the top
		if (this.y - paddleHeight / 2 < 0) {
			this.y = paddleHeight / 2;
		}
		//Make sure the paddle doesn't go below the bottom
		if (this.y > height - paddleHeight / 2) {
			this.y = height - paddleHeight / 2;
		}
	}

	this.show = function(){
		fill(200);
		noStroke();
		rect(this.x, (this.y - paddleHeight / 2), paddleWidth, paddleHeight);
	}
}