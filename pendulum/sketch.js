//Felix Albrigtsen 2018
//Double pendulum simulator
//Inspired by https://www.myphysicslab.com/pendulum/double-pendulum-en.html
//and Daniel Schiffman

//Ball properties
var m1 = 10;	//Mass of balls
var m2 = 10;
var r1 = 125; 	//Length of "arm"
var r2 = 125;

//Ball position/movement
var x1 = 0; //Coordinates of balls
var y1 = 0;
var x2 = 0;
var y2 = 0;
var a1 = 0;//Arm angle(relative to straight down)
var a2 = 0;
var a1v = 0; //Arm angle velocity
var a2v = 0;

const dampen = 0.98;

//Constants
let g = 1;
var centerx, centery;

var dots = [];

function setup() {
	createCanvas(500, 300);
	background(50);
	centerx = width / 2;
	centery = 30;

	a1 = PI / 2 - PI / 8;
	a2 = PI / 2;
	//a2 = PI;

	translate(centerx, centery);
}
function reset() {
	a2 = PI; a1 = PI; a1v = 0; a2v = 0; a1a = 0; a2a = 0;
}

function draw() {
	var enu1 = -g * ((2 * m1) + m2) * sin(a1) - m2 * g * sin(a1 - (2* a2)) - (2 * sin(a1-a2) * m2 * (a2v * a2v * a2 + a1v * a1v * a1 * cos(a1 - a2)));
	var den1 = r1 * ((2 * m1) + m2 - (m2 * cos((2 * a1) - (2 * a2))));

	var enu2 = 2 * sin(a1 - a2) * (a1v * a1v * r1 * (m1 + m2) + (-g * (m1 + m2) * cos(a1)) + (a2v * a2v * r2 * m2 * cos(a1-a2)));
	var den2 = r2 * ((2 * m1) + m2 - m2 * cos((2*a1) - (2*a2)));

	//var num1 = 2 * sin(a1 - a2);
  	//var num2 = (a1v * a1v * r1 * (m1 + m2));
 	//var num3 = g * (m1 + m2) * cos(a1);
	//var num4 = a2v * a2v * r2 * m2 * cos(a1 - a2);
 	//var den = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
	//a2a = (num1 * (num2 + num3 + num4)) / den;


	a1a = -(enu1 / den1); //Acceleration
	a1v += a1a; //Add acceleration to velocity
	a1 += a1v; //Add velocity to angle;

	a2a = (enu2 / den2);
	//a2a = 0;
	a2v += a2a;
	a2 += a2v;

	//a1 *= 0.997 //Dampen velocity
	//a2 *= 0.997
	a1v *= dampen;
	a2v *= dampen;

	//Calculate ball1  position
	x1 = r1 *  sin(a1);
	y1 = -r1 * cos(a1);

	//Calculate ball2 position
	x2 = x1 + (r2 * sin(a2));
	y2 = y1 - (r2 * cos(a2));

	//Clear background
	background(50);
	//Draw arms and balls
	fill(255);
	stroke(255);
	strokeWeight(2);
	translate(centerx, centery);
	line(0, 0, x1, y1);
	line(x1, y1, x2, y2);
	ellipse(x1, y1, m1, m1);
	ellipse(x2, y2, m2, m2);

	for (i = 0; i < dots.length; i++) {
		ellipse(dots[i][0], dots[i][1], 1, 1);
	}

	dots.push([x2, y2]);
	if (dots.length > 1000) {
		dots.shift();
	}
  
}