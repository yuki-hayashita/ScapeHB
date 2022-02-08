import "./Landscape.css";
import React, { useState, useRef, useEffect } from 'react'
import { SketchPicker } from 'react-color'

function Landscape() {

    const canvasRef = useRef(null);

    useEffect(() => {
        init();
        const interval = setInterval(() => {
            tick();
            placeSand();
        }, 1);
        return () => clearInterval(interval);
    }, [])

    const cellSize = 5;
    const width = Math.floor(window.innerWidth/cellSize);
    const height = Math.floor((window.innerHeight)/cellSize);
    const canvasWidth = width * cellSize;
    const canvasHeight = height * cellSize;
    var isDrawing = false;
    var buffer = [];
    var thunderBuffer = [];
    var EMPTY = 0;
    var WALL = 1;
    var WATER = 2;
    var SEED = 3
    var PLANT = 4;
    var FLOWER = 5;
    var FIRE = 6
    var SMOKE = 7;
    var THUNDER = 8;
    var ASH = THUNDER + 1;
    var SAND = ASH + 1;
    var colors = {};

    colors[EMPTY] = '#b5d9dd';
    colors[WALL] = '#444';
    colors[WATER] = '#3c95dc';
    colors[SEED] = '#3fa752';
    colors[PLANT] = '#3fa752';
    colors[FLOWER] = '#b53524'
    colors[FIRE] = '#FFA500';
    colors[SMOKE] = '#90adb0';
    colors[THUNDER] = '#FBF864'
    colors[ASH] = '#90adb0';
    colors[SAND] = '#d29b0b';


    var seeds = {};
    var currElement = SAND;
    var previousBuffer = [];
    var sandParameter = SAND;

    var prevMouseX = null
    var prevMouseY = null



    const init = () => {
        const dirSwitch = 0.1;
        for (var i = 0; i < width * height; i++) {
            buffer[i] = EMPTY;
            const r = Math.random();
            if (r < dirSwitch) {
                thunderBuffer[i] = 0;
            } else if (r < (1-dirSwitch)/2 + dirSwitch) {
                thunderBuffer[i] = -2;
            } else {
                thunderBuffer[i] = +2;
            }
        }

        for (var i = 0; i < height; i++) {
            setBuf(0, i, WALL);
            setBuf(width - 1, i, WALL);
        }

        for (var x = 0; x <= width; x++) {
            setBuf(x, height - 1, WALL)
        }
    }

    const setBuf = (x, y, element) => {
        if (currElement === EMPTY || getBuf(x,y) !== WALL) {
            buffer[x + y * width] = element;
        }
    }

    const setBufConditional = (x, y, eToBeReplaced, element) => {
        if ((element === EMPTY || getBuf(x,y) !== WALL) && getBuf(x,y) !== eToBeReplaced) {
            buffer[x + y * width] = element;
        }
    }

    const getBuf = (x,y) => {
        if (x < 0 || x >= width ||
            y < 0 || y >= height)
            return EMPTY;
        return buffer[x + y * width];
    }

    const getThunderBuf = (x,y) => {
        return thunderBuffer[x + y * width];
    }

    const getIndex = (x,y) => {
        return x + y * width;
    }


    const sand = () => {
        currElement = sandParameter;
    }

    const drop = () => {
        currElement = WATER;
    }

    const plant = () => {
        currElement = SEED;
    }

    const wall = () => {
        currElement = WALL;
    }

    const eraser = () => {
        currElement = EMPTY;
    }

    const fire = () => {
        currElement = FIRE;
    }

    const thunder = () => {
        currElement = THUNDER;
    }

    const randColor = () => {
        newColor();
    }

    const clear = () => {
        init();
    }

    const newColor = () => {
        // colors[SAND] = '#FF0000';
        const colorr = Math.floor(Math.random()*16777215).toString(16);
        //colors[SAND] = '#' + randomColor;

        sandParameter += 1;
        colors[sandParameter] = '#' + colorr;
        currElement = sandParameter;
    }

    const isEmpty = (x,y) => {
        if (getBuf(x,y) === 0){
            return true;
        } else {
            return false;
        }
    }

    const isSand = (x,y) => {
        if (getBuf(x,y) >= SAND){
            return true;
        } else {
            return false;
        }
    }

    const placeSand = () => {
        if (isDrawing) {
            //     const mouseX = Math.floor(e.clientX / cellSize)
            //     const mouseY = Math.floor(e.clientY / cellSize)
            //
            //     if (prevMouseX == null) {
            //         prevMouseX = mouseX
            //     }
            //
            //     if (prevMouseY == null) {
            //         prevMouseY = mouseY
            //     }
            const mouseX  = prevMouseX;
            const mouseY = prevMouseY;

            if (currElement === EMPTY || (currElement !== EMPTY && isEmpty(mouseX, mouseY) && currElement !== SEED)) {
                if (currElement === WALL || currElement === EMPTY) {
                    const xDiff = mouseX - prevMouseX;
                    const yDiff = mouseY - prevMouseY;
                    const p1 = [prevMouseX, prevMouseY]
                    const p2 = [mouseX, mouseY]

                    if (Math.abs(xDiff) >= Math.abs(yDiff)) {
                        const shift = yDiff / xDiff;
                        const leftPoint = (mouseX > prevMouseX) ? p1 : p2;
                        const rightPoint = (mouseX > prevMouseX) ? p2 : p1;

                        let y = leftPoint[1]
                        let prevY = leftPoint[1]

                        for (let x = leftPoint[0]; x <= rightPoint[0]; x++) {
                            setBuf(x, Math.floor(y), currElement);
                            y += shift;

                            if (Math.floor(y) != Math.floor(prevY)) {
                                setBuf(x + 1, Math.floor(prevY), currElement);
                            }

                            prevY = y;
                        }
                    }
                    else {
                        const shift = xDiff / yDiff;
                        const topPoint = (mouseY > prevMouseY) ? p1 : p2;
                        const bottomPoint = (mouseY > prevMouseY) ? p2 : p1;

                        let x = topPoint[0]
                        let prevX = topPoint[0]

                        for (let y = topPoint[1]; y <= bottomPoint[1]; y++) {
                            setBuf(Math.floor(x), y, currElement);
                            x += shift;

                            if (Math.floor(x) != Math.floor(prevX)) {
                                setBuf(Math.floor(prevX), y + 1, currElement);
                            }

                            prevX = x;
                        }
                    }
                }
                else {
                    setBuf(mouseX, mouseY, currElement);
                }
            } else if (currElement == SEED && isSand(mouseX,mouseY)) {
                seeds[getIndex(mouseX,mouseY)] = Math.floor(Math.random()*20);
                setBuf(mouseX, mouseY, SEED);
            } else if (currElement == FIRE) {
                setBuf(mouseX, mouseY, FIRE);
            }
            prevMouseX = mouseX;
            prevMouseY = mouseY;
        }
    }

    const neighbor = (x,y,element) => {
        if (getBuf(x-1, y) == element || getBuf(x+1, y) == element || getBuf(x-1, y-1) == element ||
            getBuf(x-1, y+1) == element || getBuf(x, y-1) == element || getBuf(x, y+1) == element ||
            getBuf(x, y-1) == element || getBuf(x, y+1) == element
        ) {
            return true;
        } return false;
    }

    var emptyOrLiquid = [EMPTY, WATER];
    function update() {

        var thunderDir = Math.random() < 0.5 ? -1 : 1;

        for (var y = height-1; y >= 0; y--) {
            var moveHoriz = [];
            for (var x = 0; x < width; x++) {
                // set dir to +1 or -1 randomly
                var dir = Math.random() < 0.5 ? -1 : 1;
                if (getBuf(x, y) >= ASH) { // if we have sand
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
                        setBufConditional(x, y, PLANT, FLOWER);
                        if (r > 0.98) {
                            setBufConditional(x - 1, y + 1, PLANT, FLOWER);
                            setBufConditional(x + 1, y + 1, PLANT, FLOWER);
                            setBufConditional(x - 1, y - 1, PLANT, FLOWER);
                            setBufConditional(x + 1, y - 1, PLANT, FLOWER);
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
                    // if (getBuf(x, y+1)==EMPTY && getBuf(x-1, y)==EMPTY && getBuf(x+1, y)==EMPTY){
                    //     setBuf(x,y,EMPTY);
                    //     setBuf(x,y+1,PLANT);
                    // }
                } else if (getBuf(x, y) == FIRE){
                    var r = Math.random();
                    const offset = 0.4;
                    if (r > offset) {
                        setBuf(x,y,EMPTY);
                        if (r > 0.9) {
                            setBuf(x, y, ASH);
                        }

                        if (getBuf(x,y-2) == EMPTY) {
                            setBuf(x, y - 2, SMOKE);
                        }
                    } else if  (r <= offset) {
                        setBuf(x,y-1,FIRE);
                        if  (r > offset*2/3) {
                            setBuf(x-1,y-1,FIRE);
                        } else if (r <= offset*2/3 && r > offset/3){
                            setBuf(x+1,y-1,FIRE);
                        } else {
                            setBuf(x,y,EMPTY);
                            setBuf(x,y-2,SMOKE);
                            //setBuf(x, y, ASH);
                        }
                    }

                    if (neighbor(x,y,PLANT) || neighbor(x,y,FLOWER)){
                        setBuf(x,y,FIRE);
                        if (r < 0.2 && (getBuf(x, y+1) == PLANT || getBuf(x, y+1) == FLOWER)) {
                            setBuf(x,y+1, FIRE);
                        }
                        if (r < 0.2 && (getBuf(x-1, y+1) == PLANT || getBuf(x-1, y+1) == FLOWER)) {
                            setBuf(x-1,y+1, FIRE);
                        }
                        if (r < 0.2 && (getBuf(x+1, y+1) == PLANT || getBuf(x+1, y+1) == FLOWER)) {
                            setBuf(x+1,y+1, FIRE);
                        }

                    }
                } else if (getBuf(x, y) == SMOKE) {
                    var r = Math.random();
                    if (r < 0.05) {
                        // if (r < 0.03) {
                        //     setBuf(x, y, ASH);
                        // } else {
                        setBuf(x, y, EMPTY);
                        //}
                    }
                } else if (getBuf(x,y) == THUNDER) {
                    //var r = Math.random();
                    // if (isEmpty(x,y+1)){
                    //     //setBuf(x,y,EMPTY);
                    //     //setBuf(x,y-1,EMPTY);
                    //     const xMove = getThunderBuf(x,y+2);
                    //     setBuf(x+xMove,y+2,THUNDER);
                    //     //setBuf(x,y+1,THUNDER);
                    //     // moveHoriz.push({
                    //     //     x: x,
                    //     //     y: y+2,
                    //     //     nx: x + thunderDir,
                    //     //     element: THUNDER
                    //     // });
                    var thunderX = x;
                    var thunderY = y;
                    let xMove = getThunderBuf(thunderX,thunderY);
                    thunderX = thunderX+xMove;
                    while (getBuf(thunderX,thunderY+1) === EMPTY && thunderY+1 < height){
                        //setBuf(thunderX, thunderY, EMPTY)
                        //setBuf(thunderX, y-2, EMPTY)
                        //setBuf(thunderX,thunderY+1,THUNDER);
                        // setBuf(thunderX, y-1, EMPTY);
                        // xMove = getThunderBuf(x,y+2);
                        // thunderX = x+xMove;
                        setBuf(thunderX, thunderY, THUNDER);
                        xMove = getThunderBuf(thunderX,thunderY);
                        thunderX = thunderX+xMove;
                        thunderY += 1;
                    }
                    if (getBuf(x-2,y-1)==EMPTY && getBuf(x,y-1)==EMPTY && getBuf(x+2,y-1)==EMPTY){
                        var eraseX = x;
                        setBuf(eraseX,y,EMPTY);
                        eraseX += getThunderBuf(eraseX,y);
                        setBuf(eraseX, y+1, EMPTY);
                        eraseX += getThunderBuf(eraseX,y);
                        setBuf(eraseX, y+2, EMPTY);

                    }
                    // for (var i =thunderY; i<height; i++){
                    //     setBuf(thunderX,y+2,THUNDER);
                    // }
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

    const show = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                ctx.fillStyle = colors[getBuf(x, y)];
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }

    const tick = () => {
        update();
        show();
    }

    const startDraw = (e) => {
        isDrawing = true;
        placeSand(e);
    }

    const stopDraw = () => {
        isDrawing = false;
        prevMouseX = null;
        prevMouseY = null;
    }

    const move = (e) => {
        if (isDrawing) {
            prevMouseX = Math.floor(e.clientX / cellSize);
            prevMouseY = Math.floor(e.clientY / cellSize);
        }
    }

    return (
        <>

            <div className="top-bar-container">
                <div className="top-bar">
                    <div className="icon-container" style={{marginRight: "auto"}}>
                        <img src="randColor.png" className="icon" onClick={randColor} />
                    </div>

                    <div className="icon-container" style={{marginLeft: "auto"}}>
                        <img src="sand.png" className="icon" onClick={sand}/>
                    </div>

                    <div className="icon-container">
                        <img src="drop.png" className="icon" onClick={drop}/>
                    </div>

                    <div className="icon-container">
                        <img src="plant.png" className="icon" onClick={plant}/>
                    </div>

                    <div className="icon-container">
                        <img src="wall.svg" className="icon" onClick={wall} />
                    </div>

                    <div className="icon-container">
                        <img src="flame.png" className="icon" onClick={fire} />
                    </div>

                    <div className="icon-container">
                        <img src="flame.png" className="icon" onClick={thunder} />
                    </div>

                    <div className="icon-container">
                        <img src="eraser.png" className="icon" onClick={eraser} />
                    </div>

                    <div className="icon-container" style={{marginRight: "auto"}}>
                        <img src="trash.png" className="icon" onClick={clear} />
                    </div>

                </div>
            </div>

            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} onMouseDownCapture={startDraw} onMouseUp={stopDraw} onMouseMove={move} ></canvas>
        </>
    )

}

export default Landscape;