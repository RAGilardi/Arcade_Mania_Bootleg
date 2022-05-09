// console.log('Hello duck!')

//Anche in questa query posso usare la notazione css/html per i child!
const road = document.querySelectorAll('#grid > div');
const scoreEl = document.querySelector('#score');

//Piccolo debug: mostro gli id dei div
//  


//conservo in variabile riferimenti all'elemento che contiene la papera
const duckIdx = 1;
const duck = road[duckIdx];
road[duckIdx].classList.add('duck');

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Funzioni legate al movimento della pianta
let speed = 200;
let score = 0;


//TODO: Vorrei introdurre una transizione anche al movimento della pianta, così da avere un moviemento fluido
//! Occhio che ora l'interazione funziona perchè una classe ha due id, quindi devi intersecare animazione e spostamento da un div all'altro!
function addPlant(){
    //Aggiungere pianta
    let currentPlantIdx = road.length - 1;
    road[currentPlantIdx].classList.add('plant');

    // TODO: separa la parte di movimento usando invece di una funzione anonima una esterna a addPlant
    //Movimento pianta
    const plantIntVal = setInterval(function(){
        score++;
        scoreEl.innerText = score;

        if(score % 50 === 0){
            speed = speed - 20;
        }

        road[currentPlantIdx].classList.remove('plant');
        currentPlantIdx--;
    
        if(currentPlantIdx < 0){
            clearInterval(plantIntVal);
            //! Chiamata ricorsiva!
            //TODO: renderla randomica e non limitata a una pianta a schermo e aggiungere velocità
            addPlant();
            return;
        }

        if(
            //quando pianta e papera sono vicine e lei non è in salto, game over
            currentPlantIdx === duckIdx &&
            !road[currentPlantIdx].classList.contains('duck-jump')
        ){
            showAlert('Crash!\nGame Over!');
            clearInterval(plantIntVal);
            road[currentPlantIdx].classList.remove('duck');
            road[currentPlantIdx].classList.add('plant');
            return;
        }
    
        road[currentPlantIdx].classList.add('plant');
    }, speed);
}

addPlant();

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Funzione legata al salto della papera e eventListener
//Il salto si ottiene con CSS Transform del div che contiene la papera
function jump(event){
    //La prima condizione chiede di controllare se ho cliccato specificatamente il tasto chiamato spazio (lo sa lui)
    //La seconda condizione equivale ad event.repeat === False
    //significa che è vera solo se l'event non è stato ascoltato più volte (un click, un ascolto, non continua a triggerarsi se tengo il dito sul tasto)
    if(event.code === 'Space' &&
        !event.repeat)
        {
            //console.log('jump!', event);

            //Questa versione funzionare funziona... ma è legnosina
            duck.classList.add('duck-jump');
            setTimeout(function(){
                duck.classList.remove('duck-jump');
            },300);

            //Allora piuttosto decido di usare le CSS transitions, per fare una transizione fluida
            // !DA USARE PER LE ANIMAZIONI DI PASSAGGIO OVER AI BOTTONI MAGARI ALLA LORO OPACITÀ
        }
}

document.addEventListener('keydown', jump)
