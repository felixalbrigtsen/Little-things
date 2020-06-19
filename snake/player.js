function Player() {
	this.i = floor(random(cols));
	this.j = floor(random(rows));

	this.xv = 1;
	this.yv = 0;

	this.trail = []

	this.show = function() {
		stroke(0);
		strokeWeight(1);
		fill(0, 255, 0);

		//console.log(this.tail);
		for (var i = 0; i < this.tail; i++) {
			rect(this.trail[i][0], this.trail[i][1], scl, scl);
			//console.log(this.trail);
			if (i < this.trail.length -1 && this.trail[i][0] == this.x && this.trail[i][1] == this.y) {
				this.tail = 1;
			}
		}
	}

	this.update = function() {
		
		if (keyIsDown(UP_ARROW) == true) {
			this.xv = 0;
			this.yv = -1;
		}
		if (keyIsDown(DOWN_ARROW) == true) {
			this.xv = 0;
			this.yv = 1;
		}
		if (keyIsDown(RIGHT_ARROW) == true) {
			this.xv = 1;
			this.yv = 0;
		}
		if (keyIsDown(LEFT_ARROW) == true) {
			this.xv = -1;
			this.yv = 0;
		}
		

		this.i += this.xv;
		this.j += this.yv;

		if (this.i > cols - 1) {
			this.i = 0;
		}

		if (this.j > rows - 1) {
			this.j = 0;
		}

		if (this.i < 0) {
			this.i = cols - 1;
		}

		if (this.j < 0) {
			this.j = rows - 1;
		}

		this.x = this.i * scl;
		this.y = this.j * scl;

		this.trail.push([this.x, this.y]);
		//console.log(this.trail);

		while(this.trail.length > this.tail) {
			this.trail.shift();
		}
	}
}