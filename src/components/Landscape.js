import "./Landscape.css";
import React, { useState, useRef, useEffect } from 'react'

function Landscape() {

    const canvasRef = useRef(null);

    useEffect(() => {
        init();
        const interval = setInterval(() => {
            tick();
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
    var currElement = SAND;
    var previousBuffer = [];
    var sandParameter = SAND;

    var prevMouseX = null
    var prevMouseY = null

    const init = () => {
        for (var i = 0; i < width * height; i++) {
            buffer[i] = EMPTY;
        }
    
        for (var i = 0; i < height; i++) {
            setBuf(0, i, WALL);
            setBuf(width - 1, i, WALL);
        }
    
        for (var x = 0; x <= width; x++) {
            setBuf(x, height - 1, WALL)
        }
    }

    const setBuf = (x, y, val) => {
        buffer[x + y * width] = val;
    }

    const getBuf = (x,y) => {
        if (x < 0 || x >= width ||
            y < 0 || y >= height)
            return EMPTY;
        return buffer[x + y * width];
    }

    const getIndex = (x,y) => {
        return x + y * width;
    }

    const save = () => {

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

    const placeSand = (e) => {
        if (isDrawing) {
            const mouseX = Math.floor(e.clientX / cellSize)
            const mouseY = Math.floor(e.clientY / cellSize)

            if (prevMouseX == null) {
                prevMouseX = mouseX
            }

            if (prevMouseY == null) {
                prevMouseY = mouseY
            }

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
            } else if (currElement == SEED && isSand(mouseX,mouseY)){
                seeds[getIndex(mouseX,mouseY)] = Math.floor(Math.random()*20);
                setBuf(mouseX, mouseY, SEED);
            }
            prevMouseX = mouseX;
            prevMouseY = mouseY;
        }
    }

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

    const draw = () => {
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
        think();
        draw();
    }
    
    const startDraw = () => { 
        isDrawing = true;
        
    }

    const stopDraw = () => {
        isDrawing = false;
        prevMouseX = null;
        prevMouseY = null;
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
                        <img src="eraser.png" className="icon" onClick={eraser} />
                    </div>

                    <div className="icon-container" style={{marginRight: "auto"}}>
                        <img src="trash.png" className="icon" onClick={clear} />
                    </div>

                </div>
            </div>

            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} onMouseDown={startDraw} onMouseUp={stopDraw} onMouseMove={placeSand}></canvas>
        </>
    )

}
  
export default Landscape;