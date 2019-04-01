"use strict";

var board = {};
var sketch = {};

var word = "PRANI";
board.spacesize = 10
board.minBoxGridSize = 6;
board.minGridPointLength = 6;
board.paddingTolerance = 5;

const HEADING = "Drag and create a box inside the canvas to see the magic";
const REDRAW_HEADING = "The box is too small to work out. Please try again";

window.onload = function () {
    console.log("window loaded");
    attachCanvasEventListener();
}

function attachCanvasEventListener() {
    document.getElementById("canvas").onmousedown = mouseDownEventHandler;
    document.getElementById("canvas").onmouseup = mouseUpEventHandler;
}

function clickEventHandler() {
    console.log("canvas clicked");
}

function mouseDownEventHandler(e) {
    console.log(e.clientX + " " + e.clientY);
    board.topleftX = e.clientX;
    board.topleftY = e.clientY;
    // clear the board
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var rect = canvas.getBoundingClientRect();
        board.topleftX = (board.topleftX - rect.left) / (rect.right - rect.left) * canvas.width;
        board.topleftY = (board.topleftY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    }
}

function mouseUpEventHandler(e) {
    console.log(e.clientX + " " + e.clientY);
    board.bottomrightX = e.clientX;
    board.bottomrightY = e.clientY;
    // draw the rect
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        strokeBoard(ctx);
        createBitmapObject();
        if (board.isPossible) {
            calculatePaths();
            paint(ctx);
        } else {
            displayRedrawMessage();
        }
    }
}


function displayRedrawMessage() {
    document.getElementById("heading").innerText = REDRAW_HEADING;
    document.getElementById("heading").classList.remove("default-heading");
    document.getElementById("heading").classList.add("redraw-heading");
    setTimeout(displayHeading, 2000);
}


function displayHeading() {
    document.getElementById("heading").innerText = HEADING;
    document.getElementById("heading").classList.remove("redraw-heading");
    document.getElementById("heading").classList.add("default-heading");
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function strokeBoard(ctx) {
    var rect = canvas.getBoundingClientRect();
    board.bottomrightX = (board.bottomrightX - rect.left) / (rect.right - rect.left) * canvas.width;
    board.bottomrightY = (board.bottomrightY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    if (board.topleftX && board.bottomrightX) {
        board.width = board.bottomrightX - board.topleftX;
    }
    if (board.topleftY && board.bottomrightY) {
        board.height = board.bottomrightY - board.topleftY;
    }
    calculateMinRequirements();
    // ctx.strokeRect(board.topleftX, board.topleftY, board.width, board.height);
}

function calculateMinRequirements() {
    board.characters = word.length;
    board.minHeightRequired = board.minBoxGridSize * board.minGridPointLength + board.paddingTolerance;
    console.log("min height - " + board.minHeightRequired + " board height - " + board.height);
    board.minWidthRequired = board.minBoxGridSize * board.minGridPointLength * board.characters + board.spacesize * (board.characters - 1) + board.paddingTolerance;
    console.log("min width - " + board.minWidthRequired + " board width - " + board.width);
    if (board.height >= board.minHeightRequired && board.width >= board.minWidthRequired) {
        board.isPossible = true;
    } else {
        board.isPossible = false;
    }
}

function calculatePaths() {
    board.characters = word.length;
    board.maxBoxWidth = (board.width - (board.paddingTolerance + (board.characters - 1) * board.spacesize)) / board.characters;
    board.maxBoxHeight = (board.height - board.paddingTolerance);
    var rmaxrow = board.maxBoxWidth / (6 * board.minGridPointLength);
    var rmaxcol = board.maxBoxHeight / (6 * board.minGridPointLength);
    var rmax = Math.min(rmaxrow, rmaxcol);
    var cmaxrow = board.maxBoxWidth / (6);
    var cmaxcol = board.maxBoxHeight / (6);
    var cmax = Math.min(cmaxcol, cmaxrow);
    rmax = parseInt(rmax);
    cmax = parseInt(cmax);
    board.maxBoxGridSize = rmax;
    board.maxGridPointLength = cmax;
    Math.floor(Math.random() * (board.maxBoxGridSize - board.minBoxGridSize)) + board.minBoxGridSize;
    console.log(board.minGridPointLength + " /-/ " + board.maxGridPointLength);
    var crandom = Math.floor(Math.random() * (board.maxGridPointLength - board.minGridPointLength)) + board.minGridPointLength;
    var rcorrelatedrow = Math.floor(board.maxBoxWidth / (6 * crandom));
    var rcorrelatedcol = Math.floor(board.maxBoxHeight / (6 * crandom));
    var rcorrelated = Math.min(rcorrelatedrow, rcorrelatedcol);
    board.gridPointLength = crandom;
    board.cellcount = 6 * rcorrelated;
    console.log("c = " + crandom + " r = " + board.cellcount);
}

function paint(ctx) {

    var curX = board.topleftX;
    var curY = board.topleftY;
    const cellsize = board.gridPointLength;
    [...word].forEach((ch) => {
        var arr = bitmap[ch + ""];
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j][i] == 1) {
                    //window.requestAnimationFrame(() => ctx.fillRect(curX + (i*cellsize), curY + (j*cellsize), cellsize, cellsize));
                    //noop();
                    //paintCell(ctx, curX, curY, i, j, cellsize);
                    // window.requestAnimationFrame(() => {
                        
                    //         ctx.fillStyle = "black";
                    //         ctx.fillRect(curX + (i * cellsize), curY + (j * cellsize), cellsize, cellsize);
                        
                    // });
                    // var context = ctx;
                    // var currentX = curX;
                    // var currentY = curY;
                    // var i1 = i;
                    // var j1 = j;
                    // var cs = cellsize;
                    // window.requestAnimationFrame(() => {
                    //     paintCell(context, currentX, currentY, i1, j1, cs);
                    // });
                    

                    ctx.fillStyle = calculateFillStyle();
                    ctx.fillRect(curX + (i*cellsize), curY + (j*cellsize), cellsize, cellsize);
                }
            }
        }
        curX = curX + board.cellcount * cellsize + board.spacesize;
    })

    function calculateFillStyle(){
        var red = 0;
        var blue = 0;
        var green = 0;
        var colorScheme = calculateRandom(0,4);
        if(colorScheme == 0){
            red = 0;
            green = 0;
            blue = 0;
        } else if(colorScheme == 1){
            red = calculateRandom(0,255);
            green = calculateRandom(0,30);
            blue = calculateRandom(0,30);
        } else if(colorScheme == 2){
            red = calculateRandom(0,130);
            green = calculateRandom(10,230);
            blue = calculateRandom(0,100);
        } else if(colorScheme == 3){
            red = calculateRandom(0,80);
            green = calculateRandom(0,30);
            blue = calculateRandom(0,250);
        }else{
            red = calculateRandom(0,255);
            green = calculateRandom(0,255);
            blue = calculateRandom(0,255);
        }
        var fillstyle = `rgb(${red},${blue},${green})`;
        return fillstyle;
    }

    function calculateRandom(upperLimit, lowerLimit){
        return Math.floor(Math.random() * (upperLimit - lowerLimit)) + lowerLimit;
    }

    // sketch.i = 0;
    // sketch.j = 0;
    // sketch.ch = 0;
    // sketch.arr = bitmap[[...word][sketch.ch]+""];
    // sketch.maxch = [...word].length-1;
    // sketch.maxi = [...word][0].length;
    // sketch.maxj = [...word].length;
    // sketch.cellsize = cellsize;
    // sketch.ctx = ctx;
    // window.requestAnimationFrame(draw);
    

}

function draw(){
    if(sketch.arr[sketch.i][sketch.j] == 1){
        console.log("printed");
        sketch.ctx.fillStyle = "black";
        sketch.ctx.fillRect(sketch.curX + (sketch.i*sketch.cellsize), sketch.curY + (sketch.j * sketch.cellsize), sketch.cellsize, sketch.cellsize);
    }

    if(sketch.j < sketch.maxj){
        sketch.j = sketch.j + 1;
        window.requestAnimationFrame(draw);
    }else if(sketch.i < sketch.maxi){
        sketch.i = sketch.i + 1;
        sketch.j = 0;
        window.requestAnimationFrame(draw);
    }else if(sketch.ch < sketch.maxch){
        sketch.ch = sketch.ch + 1;
        sketch.i = 0;
        sketch.j = 0;
        sketch.curX = sketch.curX + board.cellcount * sketch.cellsize + board.spacesize;
        sketch.arr = bitmap[[...word][sketch.ch]+""];
        window.requestAnimationFrame(draw);
    }

    
}

function paintCell(ctx, curX, curY, i, j, cellsize) {
    console.log(curX + " " + curY + " " + i + " " + j + " " + cellsize)
    ctx.fillRect(curX + (i * cellsize), curY + (j * cellsize), cellsize, cellsize);
}


function noop() {
    for (var k = 0; k < 10000; k++) {
        for (var l = 0; l < 10000; l++) {
            var a = 5;
        }
    }
}
function createBitmapObject() {

}