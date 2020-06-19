
//romList = ["CLEARMEM", "TESTB", "15PUZZLE", "BLINKY", "BLITZ", "BRIX", "CONNECT4", "GUESS", "HIDDEN", "IBM", "INVADERS", "KALEID", "MAZE", "MERLIN", "MISSILE", "PONG", "PONG2", "PUZZLE", "RANDCHAR", "SYZYGY", "TANK", "TETRIS", "TICTAC", "UFO", "VBRIX", "VERS", "WIPEOFF"];
romList = ["CLEARMEM", "Timebomb.ch8", "Paddles.ch8", "Sum Fun [Joyce Weisbecker].ch8",
"Pong [Paul Vervalin, 1990].ch8", "Syzygy [Roy Trevino, 1990].ch8", "Soccer.ch8",
"Breakout (Brix hack) [David Winter, 1997].ch8", "Breakout [Carmelo Cortez, 1979].ch8", "Puzzle.ch8",
"Blinky [Hans Christian Egeberg, 1991].ch8", "Lunar Lander (Udo Pernisz, 1979).ch8", "Squash [David Winter].ch8",
"Addition Problems [Paul C. Moews].ch8", "Rush Hour [Hap, 2006] (alt).ch8", "Blitz [David Winter].ch8",
"Space Flight.ch8", "Connect 4 [David Winter].ch8", "Brix [Andreas Gustafsson, 1990].ch8",
"Tron.ch8", "Bowling [Gooitzen van der Wal].ch8", "Missile [David Winter].ch8",
"Pong 2 (Pong hack) [David Winter, 1997].ch8", "Reversi [Philip Baltzer].ch8", "Astro Dodge [Revival Studios, 2008].ch8",
"Russian Roulette [Carmelo Cortez, 1978].ch8", "Vertical Brix [Paul Robson, 1996].ch8", "Hi-Lo [Jef Winsor, 1978].ch8",
"Kaleidoscope [Joseph Weisbecker, 1978].ch8", "Guess [David Winter].ch8", "Pong (1 player).ch8",
"Rocket Launcher.ch8", "Programmable Spacefighters [Jef Winsor].ch8", "Wipe Off [Joseph Weisbecker].ch8",
"Vers [JMN, 1991].ch8", "Tapeworm [JDR, 1999].ch8", "Nim [Carmelo Cortez, 1978].ch8",
"Tank.ch8", "Worm V4 [RB-Revival Studios, 2007].ch8", "Shooting Stars [Philip Baltzer, 1978].ch8",
"Brick (Brix hack, 1990).ch8", "Wall [David Winter].ch8", "Hidden [David Winter, 1996].ch8",
"Coin Flipping [Carmelo Cortez, 1978].ch8", "Rocket Launch [Jonas Lindstedt].ch8", "Figures.ch8",
"Biorhythm [Jef Winsor].ch8", "Tic-Tac-Toe [David Winter].ch8", "Craps [Camerlo Cortez, 1978].ch8",
"Slide [Joyce Weisbecker].ch8", "Animal Race [Brian Astle].ch8", "Space Invaders [David Winter].ch8",
"Most Dangerous Game [Peter Maruhnic].ch8", "Rush Hour [Hap, 2006].ch8", "Filter.ch8",
"Mastermind FourRow (Robert Lindley, 1978).ch8", "Tetris [Fran Dachille, 1991].ch8", "Deflection [John Fort].ch8",
"Rocket [Joseph Weisbecker, 1978].ch8", "Space Intercept [Joseph Weisbecker, 1978].ch8", "UFO [Lutz V, 1992].ch8",
"ZeroPong [zeroZshadow, 2007].ch8", "Spooky Spot [Joseph Weisbecker, 1978].ch8", "Pong (alt).ch8",
"X-Mirror.ch8", "15 Puzzle [Roger Ivie].ch8", "Submarine [Carmelo Cortez, 1978].ch8",
"Landing.ch8", "Airplane.ch8", "Merlin [David Winter].ch8",
"Cave.ch8", "Sequence Shoot [Joyce Weisbecker].ch8", "Chip-8 Programs/Jumping X and O [Harry Kleinberg, 1977].ch8",
"Chip-8 Programs/Keypad Test [Hap, 2006].ch8", "Chip-8 Programs/Framed MK1 [GV Samways, 1980].ch8", "Chip-8 Programs/Delay Timer Test [Matthew Mikolay, 2010].ch8",
"Chip-8 Programs/Minimal game [Revival Studios, 2007].ch8", "Chip-8 Programs/IBM Logo.ch8", "Chip-8 Programs/BMP Viewer - Hello (C8 example) [Hap, 2005].ch8",
"Chip-8 Programs/Framed MK2 [GV Samways, 1980].ch8", "Chip-8 Programs/Chip8 emulator Logo [Garstyciuks].ch8", "Chip-8 Programs/Random Number Test [Matthew Mikolay, 2010].ch8",
"Chip-8 Programs/Chip8 Picture.ch8", "Chip-8 Programs/Division Test [Sergey Naydenov, 2010].ch8", "Chip-8 Programs/Clock Program [Bill Fisher, 1981].ch8",
"Chip-8 Programs/Fishie [Hap, 2005].ch8", "Chip-8 Programs/Life [GV Samways, 1980].ch8", "Chip-8 Programs/SQRT Test [Sergey Naydenov, 2010].ch8",
"Chip-8 Demos/SCROLLTEXT.ch8", "Chip-8 Demos/Trip8 Demo (2008) [Revival Studios].ch8", "Chip-8 Demos/Stars [Sergey Naydenov, 2010].ch8",
"Chip-8 Demos/Maze (alt) [David Winter, 199x].ch8", "Chip-8 Demos/Sierpinski [Sergey Naydenov, 2010].ch8", "Chip-8 Demos/Sirpinski [Sergey Naydenov, 2010].ch8",
"Chip-8 Demos/Maze [David Winter, 199x].ch8", "Chip-8 Demos/Zero Demo [zeroZshadow, 2007].ch8", "Chip-8 Demos/Particle Demo [zeroZshadow, 2008].ch8",]

displayRoms = function() {
    //Puts the list of roms into the HTML <select>-list
    var menu = document.getElementById("romSelect");
    for (var i = 0; i < romList.length; i++) {
        var option = document.createElement("option");
        option.text = romList[i];
        option.value = i;
        menu.add(option);
    }
}

dlROM = function(romId){
    if (romId == 0){
        return 0x0;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "ROMS/"+romList[romId], true);

    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        myChip8.loadROM(new Uint8Array(xhr.response));
    };
    xhr.send();

}
