var PChar;
var EChar = [];
var ECount = 0;

var Ended = 0;

var difficulty = 80;
var SpawnTimer = 0;

var CandyScore = 0;
var Candy1;

function setup() {
	createCanvas(displayWidth, 480);
	PChar = new Player();
	Candy1 = new Candy();
}

function draw() {
	background(150);

	if (Ended == 1) {
		return 0;
	}

	PChar.update();
	PChar.show();

	SpawnTimer = SpawnTimer + 1;
	if (SpawnTimer == difficulty) {
		EnemySpawn();
		SpawnTimer = 0;
	}

	document.getElementById("ScoreField").innerHTML = CandyScore;

	EnemyUpdate();

	Candy1.show();
}

function EnemySpawn() {
	EChar[ECount] = new Enemy();
	ECount = ECount + 1;
}

function EnemyUpdate() {
	for (i = 0; i < ECount; i++) {
		EChar[i].update();
		EChar[i].show();
		console.log(ECount);
	}
}