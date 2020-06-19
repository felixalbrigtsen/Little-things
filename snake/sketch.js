var gameWidth = 400;
var gameHeight = 400;

var scl = 20;
var bgColor = 50;
var fps = 8;

var cols = gameWidth / scl;
var rows = gameHeight / scl;

function setup() {
	createCanvas(gameWidth, gameHeight);
	player = new Player();
	player.tail = 1;
	cherry = new Cherry();
	cherry.move();
	frameRate(fps);
}

function draw() {
	background(bgColor);

	cherry.show();

	player.update();
	player.show();

	if (cherry.touching(player) == true) {
		cherry.move();
		player.tail++;
		console.log(str(player.tail));
	}
}