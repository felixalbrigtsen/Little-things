function Enemy() {
	this.ESize = (random(35) + 5);

	this.Start = function() {

		var HorOrVer = random(3);
		HorOrVer = round(HorOrVer);

		if (HorOrVer == 0) {
			this.x = 0; //                  LEFT
			this.y = random(height);
			this.xspeed = 2;
			this.yspeed = (random(4) - 2);
		} else if (HorOrVer == 1) {
			this.x = width; //              RIGHT
			this.y = random(height);
			this.xspeed = -2;
			this.yspeed = (random(4) - 2);
		} else if (HorOrVer == 2) {
			this.x = random(width);
			this.y = 0;//                   TOP
			this.yspeed = 2;
			this.xspeed = (random(4) - 2);
		} else if (HorOrVer == 3) {
			this.x = random(width);
			this.y = height;//              BOTTOM
			this.yspeed = -2;
			this.xspeed = (random(4) - 2);
		} else {
			console.log("Invalid Value in Enemy(), HorOrVer");
		}
	}

	this.Start();


	this.update = function() {
		this.x = this.x + this.xspeed;
		this.y = this.y + this.yspeed;

		if ((this.x > width) || (this.y > height) || (this.x < 0) || (this.y < 0)) {
			this.Start();
		}

		OhNo = collideRectCircle(this.x, this.y, this.ESize, this.ESize, PChar.x, PChar.y, 15, 15);
		if (OhNo == true) {
			console.log("Hit!");
			PChar.death();
		}
	}

	this.show = function() {
		fill(255, 0, 0);
		rect(this.x, this.y, this.ESize, this.ESize);
	}


}