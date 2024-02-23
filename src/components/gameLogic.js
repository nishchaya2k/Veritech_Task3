const winningCombination = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],            //rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],            //columns
    [0, 4, 8], [2, 4, 6],                     //diagonals
]


export const checkWinner = (moves, currentPlayer, rowIndex, colIndex) => {
    const numRows = 3;
    const numCols = 3;
    const winningLength = 3;

    //check, winner row
    let rowWinner = true;

    for (let col = 0; col < numCols; col++) {
        if (moves[rowIndex * numCols + col] !== currentPlayer) {
            rowWinner = false;
            break;
        }
    }

    if (rowWinner)
        return winningCombination[rowIndex];


    //check, winner column
    let colWinner = true;

    for (let row = 0; row < numRows; row++) {
        if (moves[row * numCols + colIndex] !== currentPlayer) {
            colWinner = false;
            break;
        }

    }

    if (colWinner)
        return winningCombination[numCols + colIndex];


    // Check, winner diagonal
    let diagWinner = false;
    if (rowIndex === colIndex || rowIndex + colIndex === numRows - 1) {
        diagWinner = true;
        for (let i = 0; i < numRows; i++) {
            if (moves[i * numCols + i] !== currentPlayer) {
                diagWinner = false;
                break;
            }
        }
    }
    if (diagWinner) return winningCombination[6];

    // Check, winner anti-diagonal 
    let antiDiagWinner = false;
    if (rowIndex + colIndex === numRows - 1) {
        antiDiagWinner = true;
        for (let i = 0; i < numRows; i++) {
            if (moves[i * numCols + (numRows - 1 - i)] !== currentPlayer) {
                antiDiagWinner = false;
                break;
            }

        }
    }
    if (antiDiagWinner) return winningCombination[7];

    return false; // No winner found

}