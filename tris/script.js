//console.log("Hey Jude!")

const cells = document.querySelectorAll('.cell');

let turn = 0;
//console.log(turn);

const cellSigns = [];

//Questo ciclo for mi manda ai pazzi perchè è asincrono ed essenzialmente non sta facendo una operazione cells.lenght volte, ma la sa fare per ogni elemento di cells. Non sta scorrendo tra le celle ogni volta che si ripete, ma sa farsi per ognicella da 0 a 8... che matto
for(let i = 0; i < cells.length; i++){
    const cell = cells[i];

    cell.addEventListener('click', function(){
        //console.log(`Hai cliccato sulla cella ${i}`);
        
        if(cellSigns[i]){
            //console.log('Questa cella è già cliccata');
            return;
        }

        turn++;
        let sign;
        if(turn%2===0){
            sign = 'O';
        }else{
            sign = 'X';
        }
        cell.innerText = sign;
        
        // È possibile inserire elementi ad un array con una posizione, anche senza avergli detto a priori la sua lunghezza!
        cellSigns[i] = sign;
        //console.table(cellSigns);

        let hasWon = checkVictory();
        //console.log(`ha vinto?`, hasWon);

        if(hasWon){
            showAlert(`${sign} ha vinto!`)
        }else if(turn == 9){
            showAlert(`È un pareggio!`)
        }

    })
}

//A quanto pare in Js posso scrivere le funzioni dopo che le chiamo. Pazzi in culo.
function checkVictory(){
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 3, 6],
    ];

    for(let i = 0; i < winningCombination.length; i++){
        const combination = winningCombination[i];

        const a = combination[0];
        const b = combination[1];
        const c = combination[2];
        
        if(cellSigns[a] && cellSigns[a] === cellSigns[b] && cellSigns[b] === cellSigns[c]){
            //console.log(`Trovata combinazione vincente: ${a} ${b} ${c}`);
            return true;
        }

    }

    return false;
}