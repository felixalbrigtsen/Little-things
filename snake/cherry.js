function Cherry() {
	this.i = 0;
	this.j = 0;

	this.move = function() {
		this.i = floor(random(cols));
		this.j = floor(random(rows));
	}

	this.touching = function(entity){
		return (entity.i == this.i && entity.j == this.j) 
	}

	this.show = function() {
		this.x = this.i * scl;
		this.y = this.j * scl;

		stroke(0);
		strokeWeight(1);
		fill(255, 0, 0);
		rect(this.x, this.y, scl, scl);
	}
}