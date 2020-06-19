//What Chip8 keys are pressed
var keyPad = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]

//What pysical keyboard keys are pressed, differentiate between keyboard and GUI keys
var physicalKey = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]

//Keycodes for  1234 qwer asdf zxcv
var keys = [88, 49, 50, 51, 81, 87, 69, 65, 83, 68, 90, 67, 52, 82, 70, 86]

var anyKeyDown = false; //Used in the 0xFx0A instruction

showKeypad = function(){
    anyKeyDown = false; //Check every frame
    for (var i = 0; i < keyPad.length; i++) {
        if (keyPad[i]){
            document.getElementById("c8key_"+i.toString(16)).style.backgroundColor = "lightskyblue";
            anyKeyDown = true;
        } else {
            document.getElementById("c8key_"+i.toString(16)).style.backgroundColor = "white";
        }
    }
}

//keyPressed is called by p5 every time a keyboard key is pressed, keyReleased works the same way
keyPressed = function() {
    for (var i = 0; i < keys.length; i++) {
        if (keyIsDown(keys[i])){
            keyPad[i] = true;
            physicalKey[i] = true; 
        }

        //If we used an else statement here to disable the virtual key, then we would also disable keys when they are actually pressed by the mouse
    }
}

keyReleased = function(){
    for (var i = 0; i < keys.length; i++) {
        if (physicalKey[i] && !keyIsDown(keys[i])) { //If a key that was pressed earlier is now released, disable it
            keyPad[i] = false;
            physicalKey[i] = false;
        }
    }
}


document.getElementById("c8key_0").onmousedown = function(){
    keyPad[0x0] = true;
}
document.getElementById("c8key_0").onmouseup = function(){
    keyPad[0x0] = false;
}


document.getElementById("c8key_1").onmousedown = function(){
    keyPad[0x1] = true;
}
document.getElementById("c8key_1").onmouseup = function(){
    keyPad[0x1] = false;
}


document.getElementById("c8key_2").onmousedown = function(){
    keyPad[0x2] = true;
}
document.getElementById("c8key_2").onmouseup = function(){
    keyPad[0x2] = false;
}


document.getElementById("c8key_3").onmousedown = function(){
    keyPad[0x3] = true;
}
document.getElementById("c8key_3").onmouseup = function(){
    keyPad[0x3] = false;
}


document.getElementById("c8key_4").onmousedown = function(){
    keyPad[0x4] = true;
}
document.getElementById("c8key_4").onmouseup = function(){
    keyPad[0x4] = false;
}


document.getElementById("c8key_5").onmousedown = function(){
    keyPad[0x5] = true;
}
document.getElementById("c8key_5").onmouseup = function(){
    keyPad[0x5] = false;
}


document.getElementById("c8key_6").onmousedown = function(){
    keyPad[0x6] = true;
}
document.getElementById("c8key_6").onmouseup = function(){
    keyPad[0x6] = false;
}


document.getElementById("c8key_7").onmousedown = function(){
    keyPad[0x7] = true;
}
document.getElementById("c8key_7").onmouseup = function(){
    keyPad[0x7] = false;
}


document.getElementById("c8key_8").onmousedown = function(){
    keyPad[0x8] = true;
}
document.getElementById("c8key_8").onmouseup = function(){
    keyPad[0x8] = false;
}


document.getElementById("c8key_9").onmousedown = function(){
    keyPad[0x9] = true;
}
document.getElementById("c8key_9").onmouseup = function(){
    keyPad[0x9] = false;
}


document.getElementById("c8key_a").onmousedown = function(){
    keyPad[0xA] = true;
}
document.getElementById("c8key_a").onmouseup = function(){
    keyPad[0xA] = false;
}


document.getElementById("c8key_b").onmousedown = function(){
    keyPad[0xB] = true;
}
document.getElementById("c8key_b").onmouseup = function(){
    keyPad[0xB] = false;
}


document.getElementById("c8key_c").onmousedown = function(){
    keyPad[0xC] = true;
}
document.getElementById("c8key_c").onmouseup = function(){
    keyPad[0xC] = false;
}


document.getElementById("c8key_d").onmousedown = function(){
    keyPad[0xD] = true;
}
document.getElementById("c8key_d").onmouseup = function(){
    keyPad[0xD] = false;
}


document.getElementById("c8key_e").onmousedown = function(){
    keyPad[0xE] = true;
}
document.getElementById("c8key_e").onmouseup = function(){
    keyPad[0xE] = false;
}


document.getElementById("c8key_f").onmousedown = function(){
    keyPad[0xF] = true;
}
document.getElementById("c8key_f").onmouseup = function(){
    keyPad[0xF] = false;
}


