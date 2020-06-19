var chip8Font = [
    /* '0' */ 0xF0, 0x90, 0x90, 0x90, 0xF0,
    /* '1' */ 0x20, 0x60, 0x20, 0x20, 0x70,
    /* '2' */ 0xF0, 0x10, 0xF0, 0x80, 0xF0,
    /* '3' */ 0xF0, 0x10, 0xF0, 0x10, 0xF0,
    /* '4' */ 0x90, 0x90, 0xF0, 0x10, 0x10,
    /* '5' */ 0xF0, 0x80, 0xF0, 0x10, 0xF0,
    /* '6' */ 0xF0, 0x80, 0xF0, 0x90, 0xF0,
    /* '7' */ 0xF0, 0x10, 0x20, 0x40, 0x40,
    /* '8' */ 0xF0, 0x90, 0xF0, 0x90, 0xF0,
    /* '9' */ 0xF0, 0x90, 0xF0, 0x10, 0xF0,
    /* 'A' */ 0xF0, 0x90, 0xF0, 0x90, 0x90,
    /* 'B' */ 0xE0, 0x90, 0xE0, 0x90, 0xE0,
    /* 'C' */ 0xF0, 0x80, 0x80, 0x80, 0xF0,
    /* 'D' */ 0xE0, 0x80, 0x80, 0x80, 0xE0,
    /* 'E' */ 0xF0, 0x80, 0xF0, 0x80, 0xF0,
    /* 'F' */ 0xF0, 0x80, 0xF0, 0x80, 0x80
];
var Chip8 = function(){
    //All machine "RAM", 0x000 to 0xFFF
    //0x000-0x1FF is reserved for the interpreter and fonts
    this.memory = new Uint8Array();

    //16-byte "CPU Registers", named V0 to VE
    //VF is used for flags by the CPU, but can technically be accessed as normal
    this.v = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

    //2-byte address register used when handling memory
    this.i = null;

    //16-byte stack used only for storing return addresses of called subroutines
    this.stack = new Array(0);

    //Program Counter
    this.pc = 0x200;

    //Timers counting down to 0, decrementing one every second. Used for timing purpouses and playing sound
    this.timer_delay = 0;
    this.timer_sound = 0;

    /*
    //Backup timers when doing .start() and .stop();
    this.timerBAK_delay = 0;
    this.timerBAK_sound = 0;
    */

    //Display memory
    this.display = new Array()

    //Virtual Machine internal flags
    this.running = false;
    this.updateScreen = false;


    this.reset();
}

Chip8.prototype = {
    start: function(){
        console.log("start");
        this.running = true;

        /*
        //Load timers after a pause
        this.timer_delay = this.timerBAK_delay;
        this.timer_sound = this.timerBAK_sound;
        //this.handleTimers();
        */
    },

    stop: function(){
        console.log("stop");
        this.running = false;
        /*
        //Dump timers when pausing machine
        this.timerBAK_delay = this.timer_delay;
        this.timerBAK_sound = this.timer_sound;
        */
    },

    step: function(){
        //Do a single processor cycle and update the screen.

        /*
        //Load correct timers before stepping
        this.timer_delay = this.timerBAK_delay;
        this.timer_sound = this.timerBAK_sound; */
        this.emulateCycle();
        this.updateScreen = true;
        frame = this.display;
        drawFrame();
        showKeypad();
    },

    clearDisplay: function(){
        //Clears both the screen memory and the display buffer in the emulator  
        frame = [];
        this.display = [];
        for (var i = 0; i < canvWidth*canvHeight; i++){
            frame.push(0x00);
            this.display.push(0x00);
        }
    },

    reset: function(){
        console.log("reset");
        
        this.running = false;

        //Clear the memory
        this.memory = [];
        for (var i = 0; i < memorySize; i++) {
            this.memory.push(0x00);
        }

        //Clear the registers
        for (var i = 0; i < this.v.length; i++){
            this.v[i] = 0x00;
        }

        //Clear the stack
        this.stack = [0];
        
        //Load fonts into memory
        for (var i = 0; i < chip8Font.length; i++){
            this.memory[i] = chip8Font[i];
        }

        this.pc = 0x200;

        this.timer_delay = 0;
        this.timer_sound = 0;

        this.clearDisplay();

        document.getElementById("opcodeDisplay").innerHTML = "0x0200: 0x0000";
    },

    loadROM: function(romData){
        this.reset();

        for (var i = 0; i < romData.length; i++) {
            this.memory[i + 0x200] = romData[i];
        }
        
    },

    handleTimers: function() {
        if (myChip8.running) {
            if (myChip8.timer_delay > 0) {
                myChip8.timer_delay--;
            }

            if (myChip8.timer_sound > 0) {
                myChip8.timer_sound--;
            }
        }
        setTimeout(myChip8.handleTimers, 16.66);
    },
    /*
    test: function() { 
        //variables needed for draw 
        var cmdRegx = 0;
        var cmdRegy = 1;
        var cmdLength = 0;
        var Iaddr = 0;

        //Init letter B at coords (2, 2)
        cmdLength = 5; //5 bytes
        Iaddr = 20; 
        this.v[0] = 60;
        this.v[1] = 27;

        //Coords
        var spritex = this.v[cmdRegx];
        var spritey = this.v[cmdRegy];

        var screenAddrOffset = (spritey * canvWidth) + spritex; //Get the 1d array position of the 2d coordinates
        var wrapOffset = 0;
        var oldPixel = 0;
        var newPixel = 0;

        var sprite = new Array();
        for (var i = 0; i < cmdLength; i++) { //Read the sprite from memory into a variable
            sprite.push(this.memory[Iaddr + i]);
        }

        for (var i = 0; i < sprite.length; i++) {
            
            for (var j = 0; j < 8; j++) {
                wrapOffset = 0;
                if (spritex + j >= canvWidth) {
                    wrapOffset = -canvWidth;    //Wrap around the right edge to the left
                    console.log("wrap, J = " + j.toString(10));
                }
                oldPixel = this.display[screenAddrOffset + j + wrapOffset]; //Read screen memory
                newPixel = oldPixel ^  ((sprite[i] >> 7-j) & 0x01) //XOR the bit from the sprite
                this.display[screenAddrOffset + j + wrapOffset] = newPixel; //Update screen memory
                if (oldPixel == 1 && newPixel == 0) {
                    this.v[f] = 0x1; //Set the "unset pixel"-flag when disabling a pixel
                }
            } 

            //Go one line down
            screenAddrOffset += canvWidth;

            frame = this.display;
            drawFrame();

        }
        
    }, */
    setPixel: function(xcoord, ycoord) {
        
        //Wrap around edges
        xcoord %= canvWidth;
        ycoord %= canvHeight;

        //Set pixel
        var pixelAddress = ((ycoord * canvWidth) + xcoord);
        this.display[pixelAddress] ^= 0x1;

        if (this.display[pixelAddress] == 0) {
            //Pixel has been unset, enable the flag
            this.v[0xF] = 0x1;
        }
    },

    emulateCycle: function(){ //Main function, handles the processor instructions

        //Wrap overflow
        for (var i = 0; i < this.v.length; i++) {
            this.v[i] %= 0xFF;
        }
        this.i %= 0xFFFF

        if (this.pc > 4093){
            this.stop();
        }


        var opcode = (this.memory[this.pc] << 8) | this.memory[this.pc+1];
        this.pc += 2;
        
        document.getElementById("opcodeDisplay").innerHTML = ("0x"+("0000" +(this.pc-2).toString(16)).slice(-4)+ ": " + "0x"+("0000" + opcode.toString(16)).slice(-4));


        var x = (opcode & 0x0F00) >> 8;
        var y = (opcode & 0x00F0) >> 4;


        switch(opcode & 0xF000) { // First nibble
            case 0x0000:
                //0x00E0 - CLS
                if (opcode == 0x00E0) {
                    this.clearDisplay();
                    this.updateScreen = true;
                    break;
                }
                //0x00EE - RET
                if (opcode == 0x00EE) {
                    this.pc = this.stack.pop()
                    break;
                }
                break;
            
            case 0x1000:
                //1nnn - JMP nnn
                this.pc = opcode & 0x0FFF;
                break;

            case 0x2000:
                //2nnn - CALL nnn
                this.stack.push(this.pc);
                this.pc = opcode & 0xFFF;
                break;
            
            case 0x3000:
                //0x3xkk - SE Vx, Byte
                if (this.v[x] == (opcode & 0x00FF)){
                    this.pc += 2;
                }
                break;


            case 0x4000:
                //0x4xkk - SNE Vx, Byte
                if (this.v[x] != opcode & 0x00FF){
                    this.pc += 2;
                }
                break;

            case 0x5000:
                //0x5xy0 - SE Vx, Vy
                if (opcode & 0x000F == 0x0) { //Maybe unneeded
                    if (this.v[x] == this.v[y]) {
                        this.pc += 2;
                    }
                    break;
                }

            case 0x6000:
                //0x6xkk - LOAD Vx, byte
                this.v[x] = opcode & 0x00FF;
                break;

            case 0x7000:
                //0x6xkk - ADD Vx, byte
                this.v[x] += opcode & 0x00FF;
                break;

            case 0x8000:
                //0x8xy?

                switch(opcode & 0x000F){
                    case 0x0:
                        //0x8xy0 - LD Vx, Vy
                        this.v[x] = this.v[y];
                        break;
                    
                    case 0x1:
                        //0x8xy1 - OR Vx, Vy
                        this.v[x] |= this.v[y]
                        break;

                    case 0x2:
                        //0x8xy2 - AND Vx, Vy
                        this.v[x] &= this.v[y];
                        break;

                    case 0x3:
                        //0x8xy3 - XOR Vx, Vy
                        this.v[x] ^= this.v[y];
                        break;

                    case 0x4:
                        //0x8xy4 - ADD Vx, Vy
                        this.v[x] += this.v[y];
                        if (this.v > 255) {
                            this.v[0xF] = 0x1;//Set carry flag
                            this.v[x] %= 255; //Limit to one byte
                        }
                        break;

                    case 0x5:
                        //0x8xy5 - SUB Vx, Vy   
                        this.v[0xF] = +(this.v[x] >= this.v[y]); //Set not-borrow flag
                        this.v[x] -= this.v[y];
                        if (this.v[x] < 0) {
                            this.v[x] += 255;
                        }
                        break;
                        
                    case 0x6:
                        //0x8xy6 - SHR Vx (, Vy)
                        this.v[0xF] = this.v[x] & 0x1;
                        this.v[x] <<= 1;
                        break;

                    case 0x7:
                        //0x8xy7 - SUBN Vx, Vy
                        this.v[0xF] = +(this.v[y] >= this.v[x]); //Set not-borrow flags
                        this.v[x] = this.v[y] - this.v[x];
                        if (this.v[x] < 0) {
                            this.v[x] += 255;
                        }
                        break;

                    case 0xE:
                        //0x8xyE - SHL Vx (, Vy)
                        this.v[0xF] = +(this.v[x] & 0x80 >> 7) //Set flag
                        this.v[x] <<= 1;
                        this.v[x] %= 255;
                        break;

                    default:
                        console.log("Unimplemented or invalid opcode: " + "0x"+("0000" + opcode.toString(16)).slice(-4) + " at address " + ("0x"+("0000" +(this.pc-2).toString(16)).slice(-4)));
                }

                break;


            case 0x9000:
                if (opcode & 0x000F == 0){ //Maybe unneeded
                    //0x9xy0 - SNE Vx, Vy
                    if (this.v[x] != this.v[y]) {
                        this.pc += 2;
                    }
                }
                break;

            case 0xA000:
                //0xAnnn - LOAD I, Addr
                this.i = opcode & 0x0FFF;
                break;

            case 0xB000:
                //0xBnnn - JMP Addr + V0
                this.pc = (opcode & 0x0FFF) + this.v[0];
                break;

            case 0xC000:
                //0xCxkk - RND Vx, Byte
                this.v[x] = (Math.floor(Math.random()*255)) & (opcode & 0xFF);
                console.log(this.v[x]);
                break;

            case 0xD000:
                //0xDxyn - DRW Vx, Vy, Nibble

                this.v[0xF] = 0x0;
                
                var spritex = this.v[x];
                var spritey = this.v[y];

                //console.log("Draw sprite at \nV" + x.toString() + " " + spritex.toString() + "\nV" + y.toString() + " " + spritey.toString());

                //var screenAddrOffset = (spritey * canvWidth) + spritex; //Get the 1d array position of the 2d coordinates
                var spritePixelValue = 0;
                var oldPixel = 0;
                var newPixel = 0;
                var pixelAddress = 0;

                var spriteLength = opcode & 0xF; //Last nibble of opcode decides number of bytes ti read

                var sprite = new Array();
                for (var i = 0; i < spriteLength; i++) { //Read the sprite from memory into a variable
                    sprite.push(this.memory[this.i + i]);
                }

                
                for (var yoffset = 0; yoffset < spriteLength; yoffset++) {
                    for (var xoffset = 0; xoffset < 8; xoffset++) {
                        spritePixelValue = (sprite[yoffset] >>> 7-xoffset) & 0x01;
                        if (spritePixelValue != 0) {
                            this.setPixel(spritex + xoffset, spritey + yoffset);
                        }
                    }
                }
                /*

                for (var yoffset = 0; yoffset < spriteLength; yoffset++) {
                    for (var xoffset = 0; xoffset < 8; xoffset++) {
                        if (spritey + yoffset > canvHeight) {
                            spritey -= canvWidth;
                        }
                        if (spritex + xoffset > canvWidth) {
                            spritex -= canvWidth;
                        }

                        spritePixelValue = (sprite[yoffset] >> 7-xoffset) & 0x01

                        if (spritePixelValue >> 0) {
                            pixelAddress = ((spritey + yoffset) * canvWidth) + (spritex + xoffset);

                            oldPixel = this.display[pixelAddress];
                            newPixel = oldPixel ^ 1;

                            if (newPixel == 0) {
                                this.v[0xF] = 0x1;
                            }

                            this.display[pixelAddress] = newPixel;
                        }
                    }
                }
                */
                this.updateScreen = true;

            case 0xE000:
                if (opcode & 0xF0FF == 0xE09E) {
                    //0xEx9E - SKP Vx
                    //Skip if key in Vx is pressed

                    if (keyPad[this.v[x]]) {
                        this.pc += 2;
                    }
                    break;
                }

                if (opcode & 0xF0FF == 0xE0A1) {
                    //Skip if key in Vc is not pressed
                    
                    if (!keyPad[this.v[x]]) {
                        this.pc += 2;
                    }
                    break;
                }
                break;

            case 0xF000:
                switch(opcode & 0x00FF) {
                    case 0x07:
                        //0xFx07 - LOAD Vx, DT
                        this.v[x] = this.timer_delay;
                        break;
                    
                    case 0x0A:
                        //0xFx0A - LOAD Vx, K

                        //Wait for a key, halting execution until any keypress. Store the key (0x0-0xF) in Vx
                        if (anyKeyDown) {
                            for (var i = 0; i < keyPad.length; i++) {
                                if (keyPad[i]) {
                                    this.v[x] = i;
                                    if (document.getElementById("c8Uncheck").checked == true) {
                                        keyPad[i] = false; //Force a new keypress
                                
                                    }
                                }
                            }
                        } else {
                            this.pc -= 2; //Loop this instruction if no key is pressed.
                        }
                        break;
                    
                    case 0x15:
                        //0xFx15 - LOAD DT, Vx
                        this.timer_delay = this.v[x];
                        break;

                    case 0x18:
                        //0xFx18 - LOAD ST, Vx
                        this.timer_sound = this.v[x];
                        break;

                    case 0x1E:
                        //0xFx1E - ADD I, Vx
                        this.i += this.v[x];
                        break;

                    case 0x29:
                        //0xFx29 - LOAD F, Vx
                        //Load the address of the font of the character stored in Vx into I
                        this.i = this.v[x] * 5;
                        break;

                    case 0x33:
                        //0xFx33 - LOAD B, Vx

                        //Split Vx into decimal hundreds, tens and singles digits and store in memory [i], [i+1] and [i+2] respectively
                        this.memory[this.i] = this.v[x] - (this.v[x] % 100);
                        this.memory[this.i+1] = (this.v[x] % 100) - (this.v[x] % 10);
                        this.memory[this.i+2] = this.v[x] % 10;
                        break;

                    case 0x55:
                        //0xFx55 - LOAD [i], Vx

                        //Dump registers V0 to(including) Vx into memory, starting at location I
                        for (var j = 0; j < x; j++){
                            this.memory[this.i + j] = this.v[j];
                        }
                        break;

                    case 0x65:
                        //pxFx65 - LOAD Vx, [i]

                        //Load into registers V0 to(including) Vx from memory starting at location
                        for (var j = 0; j < x; j++) {
                            this.v[j] = this.memory[i+j];
                        }
                        break;
                    default:
                        console.log("Unimplemented or invalid opcode: " + "0x"+("0000" + opcode.toString(16)).slice(-4) + " at address " + ("0x"+("0000" +(this.pc-2).toString(16)).slice(-4)));
                } 
                break;
            
            default:
                console.log("Unimplemented or invalid opcode: " + "0x"+("0000" + opcode.toString(16)).slice(-4) + " at address " + ("0x"+("0000" +(this.pc-2).toString(16)).slice(-4)));
            }
    }
}
