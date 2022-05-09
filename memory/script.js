//console.log("Hello")

const cards = ['alien', 'bug', 'duck', 'rocket', 'spaceship', 'tiktac'];

//ora useremo lo strumento spread ... che essenzialmente rappresenta l'esploso degli elementi dell'array: ...carsds = alien, bug, duck...

const deck = [...cards, ...cards];

//ora mettiamo dinamicamente le carte sul nostro tavolo da gioco
const grid = document.querySelector('#grid');

//Nella lezione hanno parlato anche delle funzioni di sort, che analizzano i valori (COME STRINGHE) a coppie e hanno bisogno di tornare un valore. Se >0 b prima di a, se <o a prima di b, se ==0 mantiene ordine

//esempio:
//array.sort(function(a,b){
//    return a-b;
//});

//io li voglio disordinare, quindi ritorno un random (math.random torna un numero tra 0 e 0.99)
deck.sort(function(){
    return 0.5 - Math.random();
});

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Funzione principale di interazione
for(let i = 0; i < deck.length; i++){
    const card = document.createElement('div');
    card.classList.add('card');

    //qui stiamo assegnando ad ogni carta un valore per un data-attribute che sono delle qualità custom che possiamo aggiungere, modificare e assegnare ad ogni tag. Si chiamano data-*** e sono accessibili con getAttribute o cose simili
    const cardName = deck[i];    
    card.setAttribute('data-name', cardName);

    //cito la funzione per girare le carte. L'event listener passa UN SACCO di parametri in input alla funzione!
    card.addEventListener('click', flipcard);

    grid.appendChild(card);
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Funzione per girare le carte
let pick = [];

function flipcard(event){
    //guarda quante cose passa l'event listener!
    //console.log(event);

    //non c'è sovrapposizione tra le const card perchè sono in ambienti diversi
    const card = event.target;

    if(card.classList.contains('flipped')) return;

    //aggiungo alle classi dell'oggetto il loro data-name! e flipped serve a non ri-flipparle
    card.classList.add(card.getAttribute('data-name'), 'flipped');

    pick.push(card);
    console.log(pick);

    if(pick.length === 2) {
        //check for match
        checkForMatch();
    }
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//controllo se ho una coppia e conto errori
let errors = 0;

//Questa mi serve per inizializzare a 0 il numero di errori
const errorCounter = document.querySelector('#error');
errorCounter.innerText = errors;

//Funziona che controlla se ho coppia o no
function checkForMatch(){
    const card1 = pick[0];
    const card2 = pick[1];

    const card1Name = card1.getAttribute('data-name');
    const card2Name = card2.getAttribute('data-name');

    if(card1Name == card2Name){
        //console.log('hai fatto match!');
        checkForWin();

    } else {
        //console.log('non hai fatto match!');

        //se non dico di aspettare, non farei in tempo a vedere le carte flippate
        setTimeout(function(){
            card1.classList.remove(card1Name, 'flipped');
            card2.classList.remove(card2Name, 'flipped');
            
            //è discutibile decidere se ritardare anche il conto degli errori, ma se lo faccio senza ritardo mi distrae dalle immagini
            errors++;
            errorCounter.innerText = errors;    
        }, 500);
    }

    pick = [];
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//controllo se ho vinto
function checkForWin(){
    const flippedCards = document.querySelectorAll('.flipped');
    //console.log(flippedCards);

    if(flippedCards.length == deck.length){
        //console.log('hai vinto!');

        //showAlert è una funzione in common/utils.js
        showAlert('Hai vinto!');
    }
}