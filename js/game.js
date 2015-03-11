// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

//Rock image
var rockReady = false;
var rockImage = new Image();
rockImage.onload = function () {
	rockReady = true;
};
rockImage.src = "images/stone.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var rock = {};
var princessesCaught = 0;
var rocks_array = [];
var monsters_array = [];
var level =0;

//if(localStorage["lvl"]!= null){
//	level = localStorage["lvl"];
//}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {

	var number = level;

	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly

	princess.x = 32 + (Math.random() * (canvas.width - 96));
	princess.y = 32 + (Math.random() * (canvas.height - 96));

	// Throw the rocks somewhere on the screen randomly
	rocks_array.length = 0;
		for (i= 0; i < number; i++) {
		var rock = {};
		do {
			rock.x = 32 + (Math.random() * (canvas.width - 96));
			rock.y = 32 + (Math.random() * (canvas.height - 96));
		} while ((rock.x <= (princess.x + 32)
			&& princess.x <= (rock.x + 32)
			&& rock.y <= (princess.y + 32)
			&& princess.y <= (rock.y + 32))
			|| (rock.x <= (hero.x + 32)
			&& rock.x <= (rock.x + 32)
			&& rock.y <= (hero.y + 32)
			&& hero.y <= (rock.y + 32)));
		rocks_array.push(rock);
		}
	};

//touch func
var touching = function (px,py) {
	var touch = false;
	for (i = 0; i < rocks_array.length; i++) {
		if (rocks_array[i].x <= (px + 16)
			&& px <= (rocks_array[i].x + 16)
			&& rocks_array[i].y <= (py + 32)
			&& py <= (rocks_array[i].y + 16)) {
			touch = true;
		}
	}
	return touch;
}

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if((hero.y -(hero.speed * modifier)) > 32 && !touching(hero.x,(hero.y -(hero.speed * modifier)))){
			
			hero.y -= hero.speed * modifier;	
		}	
	}
	if (40 in keysDown) { // Player holding down
		if ((hero.y +(hero.speed * modifier)) < 416 && !touching(hero.x,(hero.y -(hero.speed * modifier)))){
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		if ((hero.x -(hero.speed * modifier)) > 32 && !touching(hero.x,(hero.y -(hero.speed * modifier)))){
			hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		if ((hero.x +(hero.speed * modifier)) < 448 && !touching(hero.x,(hero.y -(hero.speed * modifier)))){
			hero.x += hero.speed * modifier;
		}
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		if ((princessesCaught%10)==0){
			++level;	
		}
		reset();
	}
};

//

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (rockReady) {
		for (i = 0; i < rocks_array.length; i++) {
			ctx.drawImage(rockImage, rocks_array[i].x, rocks_array[i].y);
		}
	}
	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);

	//localStorage.setItem("lvl", level);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
