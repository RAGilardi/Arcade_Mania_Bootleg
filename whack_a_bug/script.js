//console.log("Hey Jude!")

//Inserisco il punteggio iniziale
const scoreDisplay = document.querySelector('#score-display');
let score = 0;
scoreDisplay.innerText = score;

//Inseriamo il timer iniziale
const timerDisplay = document.querySelector('#timer-display');
let timeLeft = 30;
timerDisplay.innerText = timeLeft;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Logica per randomizzare bug in cella
const cells = document.querySelectorAll('.cell');

//velocità iniziale
let bugSpeed = 800; //msec

function randomBug(){
    //prima di scrivere sulla cella nuova, pulisco le vecchie
    removeBug();

    //aumento difficoltà se il giocatore è bravo
    if(score%10==0){
        bugSpeed = bugSpeed - 200;
    }

    //ora randomizzo su una cella nuova
    //floor approssima per troncamento all'intero
    const randomNumber = Math.floor(Math.random() * cells.length)
    const cell = cells[randomNumber];
    cell.classList.add('bug');    
}

const bugMovement = setInterval(randomBug, bugSpeed);

function removeBug(){
    for (let i = 0; i < cells.length; i++){
        const cellToClean = cells[i];
        cellToClean.classList.remove('bug');
    }
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Logica per quando schiacciamo gli insetti
for (let i = 0; i < cells.length; i++){
    const cell = cells[i];
    cell.addEventListener('click', function(){
        //verifico se la cella ha bug
        if(cell.classList.contains('bug')){
            //incremento punteggio
            score++;
            scoreDisplay.innerText = score;

            //feedback dello splat
            cell.classList.remove('bug');
            cell.classList.add('splat');

            //rimuovo lo splat dopo poco tempo
            setTimeout(function(){
                cell.classList.remove('splat');
            }, 200);
        }
    })
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Sezione logica del cronometro

//trigger del timer
//Nota importante. Quando chiamo le funzioni con le parentesi, dico al compilatore di farle una volta e non torno alla funzione che le chiama, in questo caso setInterval. Se le chiamo senza parentesi le uso come riferimento: falle ogni volta che serve a, in questo caso, setInterval
const timer = setInterval(countDown,1000);

//funzione conto alla rovescia
function countDown(){
    timeLeft--;
    timerDisplay.innerText = timeLeft;

    if(timeLeft == 0){
        clearInterval(timer);

        //faccio riferimento alla variabile con cui si muove il bug
        clearInterval(bugMovement);

        //pulisco il board
        removeBug();

        //comunico il risultato
        showAlert(`Time's up! You whacked ${score} bugs!`);
    }
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Tasto rigioca: versione brutta
const restartButton = document.getElementById('restart');

restartButton.addEventListener('click', function(){
    //è brutto perchè il gioco ricomincia forte e ricarico la pagina
    //io vorrei inserire la logica che fa PARTIRE il gioco in una funzione e chiamare lei
    window.location.reload();
})
