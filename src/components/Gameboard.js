import React, { useEffect, useState } from 'react'
import { checkWinner } from "./gameLogic"

const Gameboard = () => {

    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [moves, setMoves] = useState(Array(9).fill('')); // Array to track cell states
    const [moveCount, setMoveCount] = useState(0);

    const [winningCells, setWinningCells] = useState(null);
    const [winner, setWinner] = useState(null);
    const [last5Matches, setLast5Matches] = useState([]);

    useEffect(() => {
        const savedMatches = JSON.parse(localStorage.getItem('last5Matches')) || [];
        setLast5Matches(savedMatches);
    }, [])


    const updateLocalStorage = (matches) => {
        localStorage.setItem('last5Matches', JSON.stringify(matches))
    }


    const swapTurn = () => {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }

    const handleClick = (index) => {

        if (winner || moves[index] !== '')
            return;

        // Check if cell has not been clicked
        const updatedMoves = [...moves];
        updatedMoves[index] = currentPlayer;
        setMoves(updatedMoves);
        setMoveCount((prev) => (prev + 1));

        // Check for winner or draw after placing the move
        const result = checkWinner(updatedMoves, currentPlayer, Math.floor(index / 3), index % 3);
        if (result) {
            setWinner(currentPlayer);
            setWinningCells(result);
        }
        else
            swapTurn();

        if (result || moveCount === 8) {
            console.log(result)
            const matchResults = {
                PlayerWon: result ? currentPlayer : null,
                loser: result !== null ? (currentPlayer === 'X' ? 'O' : 'X') : null,
                draw: moveCount === 8 && !result ? true : false,
            }

            console.log(matchResults, moveCount)
            const updatedMatches = [matchResults, ...last5Matches.slice(0, 4)];
            console.log(matchResults)
            setLast5Matches(updatedMatches);
            updateLocalStorage(updatedMatches);
        }
    }

    const reset = () => {
        setMoves(Array(9).fill(''));
        setCurrentPlayer('X')
        setMoveCount(0);
        setWinner(null)
        setWinningCells(null)
    }


    return (
        <div className='relative w-full border h-full m-auto pt-10 pb-10 flex flex-col max-sm:gap-20 sm:flex-row justify-evenly items-center'>
            <div className='pt-20 flex flex-col h-5/6 items-center justify-between'>
                <p className={`mb-10 text-3xl font-serif font-semibold ${winner || moveCount === 9 ? 'invisible' : ''}`}>Turn - {currentPlayer}</p>
                <div className=' grid grid-cols-3 w-78 gap-[4px]'>

                    {moves.map((value, index) => (
                        <div key={index} className={`w-24 h-28 rounded-md border text-4xl flex items-center justify-center ${moves[index] === '' ? 'cursor-pointer' : 'cursor-default'} ${winner && winningCells.includes(index) ? 'transition-all duration-300 bg-green-400' : ''}`} onClick={() => handleClick(index)} >{value}</div>
                    ))}

                </div>

                <button className={`text-lg font-serif font-semibold p-2 px-8 mt-10 rounded-sm drop-shadow-2xl bg-gradient-to-r from-zinc-400 to to-white hover:from-zinc-500 hover:to-zinc-600 hover:ring-2 hover:ring-zinc-400 transition duration-400 ease-out ${moveCount === 0 ? 'invisible' : ''}`} onClick={reset}>{(winner || moveCount === 9) ? 'New Game' : 'Reset'}</button>
            </div>
            <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-24 lg:h-28 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 ${(winner || moveCount === 9) ? 'transition-all ease-in-out duration-1000' : 'hidden'}`}>
                <p className='flex justify-center items-center h-full text-xl sm:text-2xl md:text-4xl xl:text-5xl'>
                    {winner ? `Hurray! Player ${winner} wins!` : 'Match Draw! Start New Game.'}
                </p>
            </div>

            <div className='h-2/5 w-60 sm:pt-10 flex flex-col gap-4 items-center justify-start'>
                <h2 className='underline text-lg font-bold'>Last 5 Matches Data</h2>
                <ul className='flex flex-col gap-4' >
                    {last5Matches.map((match, index) => {
                        return (<li key={index} className='flex flex-col text-md font-semibold text-blue-950'> {match.draw ? "Its a Draw" : `Winner: ${match.PlayerWon}, Loser: ${match.loser}`}</li>)
                    })}
                </ul>
            </div>

        </div>
    )
}

export default Gameboard;


//absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2

/*
1.  The problem with this approach is that you are directly assigning a value to moves[index] =
    currentPlayer inside the condition if (moves[index] === '').

->  Direct Assignment: When you do setMoves(moves[index] = currentPlayer), you are directly
    mutating the moves array by assigning a new value to moves[index] instead of updating it
    immutably with setMoves. React relies on immutability to detect changes in state and trigger
    re-renders. Directly mutating state like this can lead to unexpected behavior and cause
    React not to detect the change.

->  useState Behavior: useState hook in React doesn't detect changes if the state is mutated
    directly. It compares the old state and the new state by reference. If you mutate the state
    directly, React won't detect the change and won't re-render the component.

->  To fix this, you need to update the moves array immutably. You can achieve this by creating
    a copy of the moves array, updating the value at the specified index in the copy, and then
    setting the state with the updated copy. This ensures that React detects the state change
    and triggers a re-render.



2.  transition-delay: Specifies the delay before the transition starts.
    transition-duration: Specifies how long the transition animation should run.
*/

