var CSize = 15;

function Candy() {
	this.x = random(width - 20) - 10;
	this.y = random(height - 20) - 10;

	this.respawn = function() {
		CandyScore = CandyScore + 1;

		this.x = random(width - 20) - 10;
		this.y = random(height - 20) - 10;
	}

	this.show = function() {
		fill(0, 255, 0);
		ellipse(this.x, this.y, CSize);

		OhNo = collideCircleCircle(this.x, this.y, CSize, PChar.x, PChar.y, 15);
		if (OhNo == true) {
			console.log("Food!");
			this.respawn();
		}
	}
}