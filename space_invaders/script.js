//console.log('hello my darling!');


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//INIT

//Genero griglia e segnapunti
const grid = document.querySelector('#grid');
const scoreEl = document.querySelector('#score');

const size = 15;
const rxc = size * size;
const cells = [];
const speed = 400;

let score = 0;
scoreEl.innerText = score;

//costruisco celle della griglia
for(let i = 0; i < rxc; i++){
    const cell = document.createElement('div');
    grid.appendChild(cell);
    cells.push(cell);

    //cell.innerText = i; //debug
}

//questo array definisce le posizioni degli alieni
const aliens = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
];

const aliensKilled = [];

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//ENDGAME
function checkForHumanWin(){
    if(aliensKilled.length === aliens.length){
        showAlert('HUMAN WINS!');
        clearInterval(alienMovIntVal);
    }
}


//TODO: Rendi più carina la condizione per far vincere gli alieni
function checkForAlienWin(){
    for(let i = 0; i < aliens.length; i++){
        if(
            !aliensKilled.includes(aliens[i]) &&
            aliens[i] >= spaceshipIdx
        ){
            showAlert('ALIEN WINS!');
            clearInterval(alienMovIntVal);           
        }
    }
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//ALIENS
function drawAliens(){
    for(let i = 0; i < aliens.length; i++){
        if(!aliensKilled.includes(i)){
            cells[aliens[i]].classList.add('alien');
        }
    }
}

function removeAliens(){
    for(let i = 0; i < aliens.length; i++){
        cells[aliens[i]].classList.remove('alien');
    }    
}

//Alien movement
//variabili per il senso di marcia
let step = 1;
let direction = 'forward' //'backward'
let alienMoveIntVal = null;

function moveAliens(){
    //Posso assegnare delle condizioni da verificare anche a delle variabili, per non mettere ste frasi nell'if
    const leftEdge = aliens[0] % size === 0;  // true|false
    const rightEdge = aliens[aliens.length - 1] % size === size - 1;  // true|false

    removeAliens();
    
    if(direction === 'forward' && rightEdge) {
        for(let i = 0; i < aliens.length; i++) {
            // Scalare di una riga 
            aliens[i] =  aliens[i] + size + 1;      
            // Invertire il senso di marcia
            step = -1;
            // Cambiare direzione
            direction = 'backward';
        }
    }

    if(direction === 'backward' && leftEdge) {
        for(let i = 0; i < aliens.length; i++) {
            // Scalare di una riga 
            aliens[i] =  aliens[i] + size - 1;      
            // Invertire il senso di marcia
            step = 1;
            // Cambiare direzione
            direction = 'forward';
        }
    }

    for(let i = 0; i < aliens.length; i++) {
        aliens[i] = aliens[i] + step;        
    }

    checkForAlienWin();
    drawAliens();

}

drawAliens();
alienMovIntVal = setInterval(moveAliens, speed);

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Spaceship controls

//initial position
let spaceshipIdx = 217;
cells[spaceshipIdx].classList.add('spaceship');

//spaceship movement
function moveSpaceship(event){
    //console.log('move!'); //debug

    const leftEdge = spaceshipIdx % size === 0;
    const rightEdge = spaceshipIdx % size === size - 1;
    
    cells[spaceshipIdx].classList.remove('spaceship');

    if(event.code === 'ArrowLeft' && !leftEdge){
        //Mi muovo a sinistra
        spaceshipIdx --;
    } else if (event.code === 'ArrowRight' && !rightEdge){
        //Mi muovo a destra
        spaceshipIdx ++;
    }

    cells[spaceshipIdx].classList.add('spaceship');
}

document.addEventListener('keydown', moveSpaceship);

//Shooting
function shoot(event){
    if(event.code !== 'Space') return;

    //console.log('bang!'); //debug

    let laserIdx = spaceshipIdx;
    let laserIntVal = null;

    //TODO: Altra funzione da splittare (laser e boom)
    function moveLaser(){
        cells[laserIdx].classList.remove('laser');
        laserIdx = laserIdx - size;

        if(laserIdx < 0){
            clearInterval(laserIntVal);
            return;
        }

        //check for shoot
        if(cells[laserIdx].classList.contains('alien')){
            //console.log('Boom!')//debug

            //prima cosa, clear del setinterval per evitare errori
            clearInterval(laserIntVal);

            cells[laserIdx].classList.remove('alien', 'laser');
            cells[laserIdx].classList.add('boom');
            setTimeout(function(){
                cells[laserIdx].classList.remove('boom');
            }, 200);

            //salvo la pettorina (ora) dell'alieno che ho colpito
            const killed = aliens.indexOf(laserIdx);
            aliensKilled.push(killed);

            //TODO: Rendi il punteggio legato al tempo!
            //Incremento punteggio
            score++;
            scoreEl.innerText = score;

            //check for player win
            checkForHumanWin();

            return;
        }

        cells[laserIdx].classList.add('laser');
    }

    laserIntVal = setInterval(moveLaser, 200);
}

document.addEventListener('keydown', shoot);
