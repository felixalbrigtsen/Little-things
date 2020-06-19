function Player() {
	var xspeed;
	var yspeed;
	this.x = width / 2;
	this.y = height / 2;
	this.xspeed = 0;
	this.yspeed = 0;
	this.update = function() {
		//this.x = mouseX;
		//this.y = mouseY;

		if (keyIsDown(LEFT_ARROW)) {
			this.xspeed = this.xspeed - 1;
		} 
		if (keyIsDown(RIGHT_ARROW)) {
			this.xspeed = this.xspeed + 1;
		} 
		if (keyIsDown(UP_ARROW)) {
			this.yspeed = this.yspeed - 1
		} 
		if (keyIsDown(DOWN_ARROW)) {
			this.yspeed = this.yspeed + 1;
		} 

		this.x = this.x + this.xspeed;
		this.y = this.y + this.yspeed;

		this.xspeed = 0;
		this.yspeed = 0;

		if (this.x > width) {
			this.x = width;
		}

		if (this.x < 0) {
			this.x = 0;
		}

		if (this.y > height) {
			this.y = height;
		}

		if (this.y < 0) {
			this.y = 0;
		}
	}

	this.show = function() {
		fill(0, 0, 255);
		ellipse(this.x, this.y, 15, 15);
	}

	this.death = function() {
		alert("You lost! Your scored " + CandyScore);
		Ended = 1;
	}
}