const board = document.querySelector("#myCanvas");
const ctx = board.getContext("2d");
let scoreBoard = document.querySelector("#ScoreBoard");
const reset = document.querySelector("#BotonReset");
const gameWidth = board.width;
const gameHeight = board.height;
const boardColor = "lightblue";
const blockColor = "grey";
let tableroTamaño = 4;
let unitSize = gameWidth / tableroTamaño;
let initialNum = 2;
const submit = document.querySelector("#submit");
const stop = document.querySelector("#BotonStop");

const upB = document.querySelector("#BotonUp");
const downB = document.querySelector("#BotonDown");
const leftB = document.querySelector("#BotonLeft");
const rightB = document.querySelector("#BotonRight");

let xPos = 0;
let yPos = 0;
let score = 0;
let tablero = [];
let running = true;

let a = 0;
let b = 0;            //variabkes temporales

const gameAuto = document.querySelector("#BotonAuto");
const gameRoll = document.querySelector("#BotonRoll");

for(let i = 0; i < tableroTamaño; i += 1){          //asignación de la tabla tamaño*tamaño por default.
    tablero[i] = [];
    for(let j = 0; j < tableroTamaño; j += 1){
        tablero[i][j] = 0;
    }
}

submit.addEventListener("click", () => {
    tablero = [];
    tableroTamaño = Number(document.querySelector("#tableroTamaño").value);
    initialNum = Number(document.querySelector("#initialNum").value);
    console.log(tableroTamaño);
    console.log(initialNum);
    unitSize = gameWidth / tableroTamaño;

    for(let i = 0; i < tableroTamaño; i += 1){          //asignación de la tabla tamaño*tamaño.
        tablero[i] = [];
        for(let j = 0; j < tableroTamaño; j += 1){
            tablero[i][j] = 0;
        }
    }
});



window.addEventListener("keydown", GameStart);

upB.addEventListener("click", boton => {
    boton.key = "ArrowUp"
    GameStart(boton);
});
downB.addEventListener("click", boton => {
    boton.key = "ArrowDown"
    GameStart(boton);
});
leftB.addEventListener("click", boton => {
    boton.key = "ArrowLeft"
    GameStart(boton);
});
rightB.addEventListener("click", boton => {
    boton.key = "ArrowRight"
    GameStart(boton);
});

reset.addEventListener("click", resetGame);

gameRoll.addEventListener("click", () => autoPlay(100, false) );

gameAuto.addEventListener("click", () => {
    stop.style.visibility = "visible";
    autoPlay(10, true);
});

stop.addEventListener("click", () => {
    running = false;
    stop.style.visibility = "hidden";
});





function GameStart(event){
    move(event);
    spawn();          //checkeo el ge en spawn
    clearTable();
    drawTable();
    checkScore();         
}

function spawn(){
    let randomNum = Math.floor(Math.random() * 4);
    let randomX = 0;
    let randomY = 0;
    let contador = 0;
    let disponible = [];

    randomNum = randomNum == 0 ? initialNum * 2 : initialNum;             //Chance entre 1 de 4 que sea 4, sino es 2.

    for(let i = 0; i < tableroTamaño; i += 1){          //asignación de la tabla tamaño*tamaño.
        for(let j = 0; j < tableroTamaño; j += 1){
            if(tablero[i][j] == 0){
                disponible.push([i,j]);
                contador += 1
            }    
        }
    } 

    randomPos = Math.floor(Math.random() * contador);       //num entre 0 y 15 inclusive --> 16 elemnetos (maximo)

    if (contador != 0){
        randomX = disponible[randomPos][0];
        randomY = disponible[randomPos][1];
        tablero[randomX][randomY] = randomNum;                  //Elijo una coordenada random disponible
    }
    else{
        checkGame();
    }
}
function move(event){
    console.log(event.key)
    switch (event.key){
        case "ArrowUp":
            for (let k=0 ;k<=tableroTamaño ;k+=1) {
                moveUp();     //asi se mueven todas las casillas lo maximo
            }
            break;
        case "ArrowDown":
            for (let k=0 ;k<=tableroTamaño ;k+=1) {
                moveDown();
            }
            break;
        case "ArrowLeft":
            for (let k=0 ;k<=tableroTamaño ;k+=1) {
                moveLeft();
            }
            break;
        case "ArrowRight":
            for (let k=0 ;k<=tableroTamaño ;k+=1) {
                moveRight();     
            }
            break;       
    }

}
function drawTable(){
    ctx.fillStyle = blockColor;
    ctx.font = "20px MV Boli";
    ctx.textAlign = "center";

    for(let i = 0; i < tableroTamaño; i += 1){                  
        for(let j = 0; j < tableroTamaño; j += 1){
            if(tablero[i][j] != 0){
                xPos = j * unitSize;
                yPos = i * unitSize;
                ctx.fillStyle = checkColor(tablero[i][j]);
                ctx.fillRect(xPos,yPos, unitSize, unitSize);
                ctx.fillStyle = "#222222";
                ctx.fillText(tablero[i][j], xPos+unitSize/2, yPos+unitSize/2);
            }
        }
        
    }
}
function clearTable(){
    ctx.fillStyle = boardColor;
    for(let i = 0; i < tableroTamaño; i += 1){                  
        for(let j = 0; j < tableroTamaño; j += 1){    
            xPos = j * unitSize;
            yPos = i * unitSize;
            ctx.fillRect(xPos,yPos, unitSize, unitSize);
        }
        
    }
}
function moveUp(){ 
    for(let i = 0; i < tableroTamaño-1; i += 1){                  
        for(let j = 0; j < tableroTamaño; j += 1){
            a = tablero[i][j];
            b = tablero[i+1][j];
            accion();
            tablero[i][j] = a;
            tablero[i+1][j] = b;
        }
    }
}
function moveDown(){ 
    for(let i = 0; i < tableroTamaño-1; i += 1){                  
        for(let j = 0; j < tableroTamaño; j += 1){
            b = tablero[i][j];
            a = tablero[i+1][j];
            accion();
            tablero[i][j] = b;
            tablero[i+1][j] = a;
        }
    }
}
function moveLeft(){ 
    for(let i = 0; i < tableroTamaño; i += 1){                  
        for(let j = 0; j < tableroTamaño-1; j += 1){
            a = tablero[i][j];
            b = tablero[i][j+1];
            accion();
            tablero[i][j] = a;
            tablero[i][j+1] = b;
        }
    }
}
function moveRight(){ 
    for(let i = 0; i < tableroTamaño; i += 1){                  
        for(let j = 0; j < tableroTamaño-1; j += 1){
            b = tablero[i][j];
            a = tablero[i][j+1];
            accion();
            tablero[i][j] = b;
            tablero[i][j+1] = a;
        }
    }
}
function accion() {       //funcion de accion en el.movimiento desde b hacia a.
    if (a == 0 && b != 0 ) {
        a = b;
        b = 0;
    } 
    else if(a == b && a != 0){ 
        score = score + a;
        a = a * 2;
        b = 0;
        console.log(score);
    }
}
function checkScore(){
    scoreBoard.innerHTML = `Score = ${score}`;
}
function checkGame(){
    for(let i = 0; i < tableroTamaño-1; i += 1){ 
        for(let j = 0; j < tableroTamaño; j += 1){
            if (tablero[i][j] == tablero[i+1][j] || tablero[j][i] == tablero[j][i+1]) {
                return
            }
        }
    }
    running = false;
    console.log("you lose");
    window.alert("You Lose");
    xPos = unitSize * gameWidth / 2;
    yPos = unitSize * gameHeight / 2;
    ctx.fillStyle = "#222222";
    ctx.font = "60px MV Boli";
    ctx.fillText("You Lose", 0, 0);
}

function resetGame(){
    clearTable();
    score = 0;
    for(let i = 0; i < tableroTamaño; i += 1){
        tablero[i] = [];
        for(let j = 0; j < tableroTamaño; j += 1){
            tablero[i][j] = 0;
        }
    }
    
}

function checkColor(number){
    switch (number){
        default:
            return blockColor;
            break;
        case initialNum * 2:
            return "blue";
            break;
        case initialNum * 4:
            return "darkblue";
            break;
        case initialNum * 8:
            return "violet";
            break;
        case initialNum * 16:
            return "red";
            break; 
        case initialNum * 32:
            return "darkmagenta";
            break; 
        case initialNum * 64:
            return "seagreen";
            break;  
        case initialNum * 128:
            return "lightgreen";
            break;  
        case initialNum * 256:
            return "gold";
            break; 
        case initialNum * 512:
            return "coral";
            break; 
        case initialNum * 1024:
            return "salmon";
            break; 
}
}

async function autoPlay(ms, repeat){
    class keys {
        key = "";
    }
    let turn = new keys;

    running = true;

    do {
        turn.key = "ArrowUp";
        GameStart(turn);
        await sleep(ms);
        if(!running){
            break;
        }
        turn.key = "ArrowLeft";
        GameStart(turn);
        await sleep(ms);
        if(!running){
            break;
        }
        turn.key = "ArrowDown";
        GameStart(turn);
        await sleep(ms);
        if(!running){
            break;
        }
        turn.key = "ArrowRight";
        GameStart(turn);
        await sleep(ms);
        if(!running){
            break;
        }
    }while(repeat)
}
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
