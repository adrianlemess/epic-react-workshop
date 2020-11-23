// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React, {useState} from 'react'
import {useLocalStorageState} from './utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  // 🐨 squares is the state for this component. Add useState for squares

  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe:currentStep',
    0,
  )

  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    Array(9).fill(null),
  ])

  const currentSquares = history[currentStep]

  // 🐨 We'll need the following bits of derived state:
  const nextValue = calculateNextValue(currentSquares)

  const winner = calculateWinner(currentSquares)

  const status = calculateStatus(winner, currentSquares, nextValue)

  const moves = history.map((move, step) => {
    const desc = step === 0 ? 'Go to game start' : `Go to game #${step}`
    const isCurrentStep = step === currentStep

    return (
      <li key={step}>
        <button onClick={() => setCurrentStep(step)} disabled={isCurrentStep}>
          {desc} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })
  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(squareIndex) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (!!currentSquares[squareIndex] || !!winner) {
      return null
    }
    const newHistory = history.slice(0, currentStep + 1)

    const currentSquaresCopy = [...currentSquares]
    currentSquaresCopy[squareIndex] = nextValue

    setHistory([...newHistory, currentSquaresCopy])
    setCurrentStep(newHistory.length)
  }

  function restart() {
    // 🐨 set the squares to `Array(9).fill(null)`
    setCurrentStep(0)
    setHistory([Array(9).fill(null)])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
