//Lei mette tutto il codice in:
//document.addEventListener('DOMContentLoaded',() =>{}

//console.log('hello my darling!');


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//INIT

//Genero griglia e segnapunti
const grid = document.querySelector('#grid');

const width = 10;
const height = 20;
const rxc = width * height;

//costruisco celle della griglia
for(let i = 0; i < rxc + width; i++){
    const cell = document.createElement('div');

    if(rxc+width-i<11){
        cell.classList.add('taken', 'bottom');
        //cell.innerText = 'check'; //debug
    }

    grid.appendChild(cell);
}

let squares = Array.from(document.querySelectorAll('#grid div'));

//costruisco mini-griglia
const minigrid = document.querySelector('#mini-grid');
const displayWidth = 4
const displayIndex = 0
const mini = displayWidth * displayWidth;

for(let i = 0; i < 16; i++){
    const cell = document.createElement('div');

    minigrid.appendChild(cell);
}

const displaySquares = document.querySelectorAll('#mini-grid div');


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Tetrominoes
//Se li disegni vedrai che queste sono le posizioni e gli a capo
const lTetromino = [
    [1, width+1, width*2+1, width*2+2],
    [width, width+1, width+2, 2],
    [0, width+1, width*2+1, 1],
    [width, width*2, width+1, width+2]
];

const jTetromino = [
    [1, width+1, width*2+1, width*2],
    [width, width+1, width+2, width*2+2],
    [1, 2, width+1, width*2+1],
    [0, width+1, width, width+2]
];

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
];

const sTetromino = [
    [1,width,width+1,width*2],
    [width, width+1,width*2+1,width*2+2],
    [1,width,width+1,width*2],
    [width, width+1,width*2+1,width*2+2],
];

const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
]

const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
];

const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
];

const theTetrominoes = [lTetromino, jTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino]

const colors = [
    'purple',
    'white',
    'cyan',
    'green',
    'yellow',
    'red',
    'blue'
]

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Tetrominoes INIT
let currentPosition = 4;
let currentRotation = 0;

let random = Math.floor(Math.random()*theTetrominoes.length);
let current = theTetrominoes[random][currentRotation]

//Draw the tetrominoes
function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}

//Cancello un tetromino
function undraw(){
    //forEach è molto carino: modifica ogni elemento di un array da com'era a come sarà usando la freccia
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
    })
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Start-stop button
let speed = 400;
let timerId = 0;
//timerId = setInterval(moveDown, speed);

const startBtn = document.querySelector('#start-button');

startBtn.addEventListener('click', () => {
    if(timerId){
       clearInterval(timerId);
       timerId = null; 
    } else{
        draw();
        timerId = setInterval(moveDown, speed);
        nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        displayShape();
    }
});

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Make the tetromino move down

//assign function to keyCodes
function control(e) {
    if(e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

document.addEventListener('keydown', control);

//Tetrominoes Movement
function moveDown(){
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

let nextRandom = 0;

function freeze(){
    //creo la condizione booleana come variabile per snellire l'if
    //some funziona che "se anche uno solo di loro"
    const condition = current.some(index => squares[currentPosition + index + width].classList.contains('taken'));

    // console.log(condition) //debug

    if(condition){
        //Blocca il tetromino aggiungendo la classe "taken"
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));

        //Start a new tetromino falling
        random = nextRandom;

        nextRandom = Math.floor(Math.random()  * theTetrominoes.length);

        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        
        draw();
        displayShape();
        addScore();
        gameOver();
    }
}

//Added Logic to make the computer know if the tetromino reached the border
function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    
    if(!isAtLeftEdge) currentPosition -=1
    
    const condition = current.some(index => squares[currentPosition + index].classList.contains('taken'));

    if(condition) {
      currentPosition +=1
    }

    draw()
  }

function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

    if(!isAtRightEdge) currentPosition +=1
    
    const condition = current.some(index => squares[currentPosition + index].classList.contains('taken'));

    if(condition){
      currentPosition -=1
    }

    draw()
  }

///FIX ROTATION OF TETROMINOS A THE EDGE 
function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }


//rotate the tetromino
function rotate(){
    undraw();
    currentRotation ++;
    if(currentRotation === current.length){
        currentRotation = 0;
    }

    current = theTetrominoes[random][currentRotation];
    
    //Questa funzione serve ad evitare bug ai bordi
    checkRotatedPosition();
    draw();
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%rown
//the Tetrominos without rotations
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, displayWidth*2+2], //lTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*2], //jTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1,displayWidth, displayWidth+1,displayWidth*2], //sTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]

//display the shape in the mini-grid display
function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
    })

    upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Score INIT
const scoreEl = document.querySelector('#score');

let score = 0;
scoreEl.innerText = score;

//Add Score
function addScore(){
    //200 is the number of cells
    for(let i=0; i<199; i+=width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

        const condition = row.every(index => squares[index].classList.contains('taken'))

        if(condition){
            score += 10;
            scoreEl.innerHTML = score;
            
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            })

            const squaresRemoved = squares.splice(i, width);
            //console.log(squaresRemoved);
            //console.log(i); //debug
            //console.log(squaresRemoved); //debug
            
            squares = squaresRemoved.concat(squares);
            //console.log(squares); //debug
            
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

//Define a Game Over
function gameOver(){
    const condition = current.some(index => squares[currentPosition + index].classList.contains('taken'));

    if(condition){
        clearInterval(timerId);
        showAlert('GameOver!')
    }
}
