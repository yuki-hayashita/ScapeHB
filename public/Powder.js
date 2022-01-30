var cellSize = 5;
var width = Math.floor(window.innerWidth/cellSize);
var height = Math.floor((window.innerHeight-50)/cellSize);
// var width = 200;
// var height = 100;
var cvs = document.createElement('canvas');
document.body.appendChild(cvs);
cvs.width = width * cellSize;
cvs.height = height * cellSize;
var ctx = cvs.getContext('2d');
var buffer = [];
var EMPTY = 0;
var WALL = 1;
var WATER = 2;
var SEED = 3
var PLANT = 4;
var FLOWER = 5;
var SAND = 6;
var colors = {};
colors[EMPTY] = '#b5d9dd';
colors[WALL] = '#444';
colors[WATER] = '#3c95dc';
colors[SEED] = '#3fa752';
colors[PLANT] = '#3fa752';
colors[FLOWER] = '#b53524'
colors[SAND] = '#d29b0b';

var seeds = {};



var isDrawing = false;
var mouseX;
var mouseY;
var currElement = SAND;
var previousBuffer = [];
var sandParameter = SAND;

window.addEventListener('mousemove', function (e){
    if (isDrawing) {
        mouseX = Math.floor(e.clientX / cellSize);
        mouseY = Math.floor(e.clientY / cellSize);
    } else {
        console.log(getBuf(Math.floor(e.clientX / cellSize),Math.floor(e.clientY / cellSize)));
    }
});

window.addEventListener('mouseup', function (e){
    isDrawing = false;
    mouseX = -1;
    mouseY = -1;
});

window.addEventListener('mousedown', function (e){
    if (e.clientX/cellSize > 0 && e.clientX/cellSize < width && e.clientY/cellSize > 0 && e.clientY/cellSize < height) {
        save();
        isDrawing = true;
    }
});



function init() {
    console.log("cleared")
// set all cells to empty
    for (var i = 0; i < width * height; i++) {
        buffer[i] = EMPTY;
    }

    for (var i = 0; i < height; i++) {
        setBuf(0, i, WALL);
        setBuf(width - 1, i, WALL);
    }

    // put some wall (1) down
    for (var x = 0; x <= width; x++) {
        setBuf(x, height - 1, WALL)
    }
}

init();

// set buffer at location (x, y)
function setBuf(x, y, val) {
    buffer[x + y * width] = val;
    // console.log("curr" +currElement+ " val"+val);
    // console.log(colors[val]);
    //console.log(val);
}

// read buffer at location (x, y)
function getBuf(x, y) {
    if (x < 0 || x >= width ||
        y < 0 || y >= height)
        return EMPTY;
    return buffer[x + y * width];
}

function getIndex(x, y){
    return x + y * width;
}



// put edges on wall
// for (var y = height - 10; y > height - 20; y--) {
//     setBuf(Math.floor(width / 2) - 10, y, WALL);
//     setBuf(Math.floor(width / 2) + 10, y, WALL);
// }

function random(){
    // colors[SAND] = '#FF0000';
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    //colors[SAND] = '#' + randomColor;

    sandParameter += 1;
    colors[sandParameter] = '#' + randomColor;
    currElement = sandParameter;
    console.log(colors[sandParameter -1]);
}



function save(){
    previousBuffer = JSON.parse(JSON.stringify(buffer));
    console.log("saved");
}

function rewind(){
    buffer = previousBuffer;
    draw();
}

function CLEAR(){
    console.log("hey");
    init();
}

function sand(){
    currElement = sandParameter;
    console.log(currElement);
    console.log(colors[currElement]);
}

function water(){
    currElement = WATER;
}

function plant(){
    currElement = SEED;
}

function eraser() {
    currElement = EMPTY;
    console.log(currElement);
}

function wall() {
    currElement = WALL;
}

function isEmpty(x,y){
    if (getBuf(x,y) === 0){
        return true;
    } else {
        return false;
    }
}

function isSand(x,y){
    if (getBuf(x,y) >= SAND){
        return true;
    } else {
        return false;
    }
}

function placeSand() {
    // place sand at top of screen
    //setBuf(Math.floor(width / 2) + Math.floor(Math.random() * 6) - 3, 3, SAND);
    // var x = event.clientX;
    // var y = event.clientX;
    //console.log(currElement);
    if (isDrawing) {
        if (currElement === EMPTY || (currElement !== EMPTY && isEmpty(mouseX, mouseY) && currElement !== SEED)) {
            //console.log("currElement");
            setBuf(mouseX, mouseY, currElement);
            //console.log(currElement);
        } else if (currElement == SEED && isSand(mouseX,mouseY)){
            console.log("plant");
            seeds[getIndex(mouseX,mouseY)] = Math.floor(Math.random()*20);
            setBuf(mouseX, mouseY, SEED);
        }
    }


    // if (currElement !== EMPTY) {
    //     if (isDrawing && isEmpty(mouseX, mouseY)) {
    //         setBuf(mouseX, mouseY, currElement);
    //     }
    // } else

}

// function placeWater() {
//     // place water at the top of screen
//     setBuf(Math.floor(width / 2) + Math.floor(Math.random() * 6) - 3, 3, WATER);
// }

var emptyOrLiquid = [EMPTY, WATER];
function think() {
    for (var y = height-1; y >= 0; y--) {
        var moveHoriz = [];
        for (var x = 0; x < width; x++) {
            // set dir to +1 or -1 randomly
            var dir = Math.random() < 0.5 ? -1 : 1;
            if (getBuf(x, y) >= SAND) { // if we have sand
                if (emptyOrLiquid.indexOf(getBuf(x, y + 1)) >= 0) { // if empty/liquid below
                    const sand = getBuf(x, y);
                    setBuf(x, y, getBuf(x, y + 1)); // clear sand
                    setBuf(x, y + 1, sand); // move sand
                } else if (emptyOrLiquid.indexOf(getBuf(x + dir, y + 1)) >= 0) { // if empty/liquid diagonal
                    const sand = getBuf(x, y);
                    setBuf(x, y, getBuf(x + dir, y + 1)); // clear sand
                    setBuf(x + dir, y + 1, sand); // move sand
                }
            } else if (getBuf(x, y) == WATER) { // if we have water
                if (getBuf(x, y + 1) == EMPTY) { // if empty below
                    setBuf(x, y, EMPTY); // clear water
                    setBuf(x, y + 1, WATER); // move water
                } else if (getBuf(x + dir, y) == EMPTY) {
                    moveHoriz.push({
                        x: x,
                        y: y,
                        nx: x + dir,
                        element: WATER
                    });
                }
             } else if (getBuf(x, y) == SEED){
                const r = Math.random()
                if (r < 0.2) {
                    setBuf(x, y, PLANT);
                    setBuf(x, y - 1, SEED);
                    if (r < 0.05) {
                        if (r < 0.025) {
                            setBuf(x - 1, y, PLANT);
                            setBuf(x - 2, y-1, PLANT);
                        } else {
                            setBuf(x + 1, y, PLANT);
                            setBuf(x + 2, y-1, PLANT);
                        }
                    }
                } else if (r > 0.97) {
                    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                    //colors[FLOWER] = '#' + randomColor;
                    setBuf(x, y, FLOWER);
                    if (r > 0.98) {
                        setBuf(x - 1, y + 1, FLOWER);
                        setBuf(x + 1, y + 1, FLOWER);
                        setBuf(x - 1, y - 1, FLOWER);
                        setBuf(x + 1, y - 1, FLOWER);
                    }
                }

                // for (var i=y; i>y-seeds[getIndex(x, y)]; i--){
                //     setBuf(x,i,PLANT);
                //     console.log("plant");
                // }
            } else if (getBuf(x, y) == PLANT){
                if (getBuf(x-1, y) == WATER || getBuf(x+1, y) == WATER || getBuf(x-1, y-1) == WATER ||
                    getBuf(x-1, y+1) == WATER || getBuf(x, y-1) == WATER || getBuf(x, y+1) == WATER ||
                    getBuf(x, y-1) == WATER || getBuf(x, y+1) == WATER
                ){
                    seeds[getIndex(x,y)] = Math.floor(Math.random()*3);
                    setBuf(x, y, SEED);
                }
            }
        }
        for (var i = 0; i < moveHoriz.length; i++) {
            var m = moveHoriz[i];
            if (getBuf(m.x, m.y) == m.element &&
                getBuf(m.nx, m.y) == EMPTY) {
                setBuf(m.x, m.y, EMPTY); // clear element
                setBuf(m.nx, m.y, m.element); // move element
            }
        }
    }
}

function draw() {
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            ctx.fillStyle = colors[getBuf(x, y)];
            // if (getBuf(x,y)>=SAND){
            //     ctx.fillStyle = colors[sandParameter];
            // }
            //ctx.fillStyle = colors[sandParameter];
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            // ctx.beginPath();
            // ctx.arc(x * cellSize, y * cellSize, cellSize, 0, 2 * Math.PI);
            // // ctx.stroke();
        }
    }
}

function tick() {
    think();
    draw();
}

// place sand every second
setInterval(placeSand, 0.1);

// place water every quarter second
//setInterval(placeWater, 1);

// draw a frame every 0.01 second
setInterval(tick, 1);