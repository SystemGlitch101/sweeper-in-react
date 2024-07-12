import { useState } from 'react';
import Cell from './Cell.jsx'

const neighbors = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1], [1, 0], [1, 1]
];

const CL_ZERO = 0; 
const CL_ONE = 1; 
const CL_TWO = 2; 
const CL_THREE = 3; 
const CL_FOUR = 4; 
const CL_FIVE = 5; 
const CL_SIX = 6; 
const CL_SEVEN = 7; 
const CL_EIGHT = 8; 
const CL_HIDE = 9; 
const CL_FLAG = 10; 
const CL_MINE = 11; 
const CL_MINERED = 12;

const GAME_READY = 0;
const GAME_PLAYING = 1;
const GAME_LOST = 2;
const GAME_WON = 3;


function FillCellData(isBomb, board, currentIndex, width) {
  board[currentIndex] = {
    data: isBomb ? CL_MINE : CL_ZERO,
    x: currentIndex % width,
    y: Math.floor(currentIndex / width),
    hidden: true,
    flagged: false
  };
}

function UpdateSquare(index, board, width, height) {
  let curr_x = index % width;	
  let curr_y = Math.floor(index / width);	
  for (let i = 0; i < 8; ++i)
  {
    let new_x = curr_x + neighbors[i][1];
    let new_y = curr_y + neighbors[i][0];
    if (IsValidCoordinate(new_x, width, new_y, height) &&
      board[new_y * width + new_x].data == CL_MINE)
    {
      ++board[index].data;
    }
  }
}

function GenerateBoard(width, height, bombCount) {
  let board = []
  let currentIndex = width * height;
	let bombsRemaining = bombCount;
  let isBomb = false;
  let chanceOfBomb = 0;

	while (currentIndex > 0) {
		chanceOfBomb = Math.floor(100 * (bombsRemaining / currentIndex));
		isBomb = (Math.floor(Math.random() * 100) <= chanceOfBomb);
		--currentIndex;

		FillCellData(isBomb, board, currentIndex, width, bombsRemaining);
    if (isBomb) {
      --bombsRemaining;
    } 
	}
  
  currentIndex = width * height;
  while (currentIndex > 0)
  {
    --currentIndex
    if (board[currentIndex].data == CL_MINE)
    {
      continue;
    }
    UpdateSquare(currentIndex, board, width, height);
  }

  return board;
}

function RevealBoard(board) {
  return board.map((cell) => { cell.hidden = false; return cell; })
}

function OpenZeroAreaRecursive(board, i, width, height, visitedBoard) {
  visitedBoard[i] = true;
  board[i].hidden = false;
  const curr_x = i % width;	
  const curr_y = Math.floor(i / width);	
  
  for (let i = 0; i < 8; ++i)
  {
    let new_x = curr_x + neighbors[i][1];
    let new_y = curr_y + neighbors[i][0];
    let newIndex = new_y * width + new_x;
    if (IsValidCoordinate(new_x, width, new_y, height))
    {
      board[newIndex].hidden = false;
      if (board[newIndex].data == CL_ZERO && !visitedBoard[newIndex]) {
        OpenZeroAreaRecursive(board, newIndex, width, height, visitedBoard);
      }
    }
  }
}

function OpenZeroArea(board, i, width, height, visitedBoard) {
  OpenZeroAreaRecursive(board, i, width, height, visitedBoard)
  return board;
}

function IsValidCoordinate(new_x, width, new_y, height) {
  return new_x >= 0 && new_x < width && new_y >= 0 && new_y < height;
}

function MinesweeperGame( {width, height, bombCount} ) {
  const [gameState, setGameState] = useState(GAME_READY);
  const [board, setBoard] = useState(GenerateBoard(width, height, bombCount));

  const handleClick = (index) => {
    switch (gameState) {
      case GAME_READY: 
        setGameState(GAME_PLAYING)
      case GAME_PLAYING: 
        break; 
      case GAME_LOST: 
      case GAME_WON:
        return;
    }
    let newCell = board[index]
    newCell.hidden = false
    
    const checkCell = (cell, i) => {
      if (gameState == GAME_LOST) {
        return cell;
      }
      if (i === index) {
        switch (cell.data) {
          case CL_MINE: 
            setGameState(GAME_LOST)
            setBoard(RevealBoard(board))
          case CL_FLAG:
            return cell;
          case CL_ZERO:
            let visitedBoard = new Array(width * height)
            visitedBoard.fill(false)
            setBoard(OpenZeroArea(board, i, width, height, visitedBoard))
        }
        return newCell
      }
      else {
        return cell;
      }
    }  
    setBoard(board.map(checkCell))
  }

  const RenderCell = (cell, index) => {
    let data = cell.data
    if (cell.hidden == true) {
      if (cell.flagged == true) {
        data = CL_FLAG
      } else {
        data = CL_HIDE
      }
    }
    return <Cell key={index} boardIdx={index} cellIdx={data} x={cell.x} y={cell.y} handleClick={handleClick} />
  }
  

  return (
    <>
      {board.map((cell, index) => RenderCell(cell, index))}
      <button className='reset-button' onClick={() => { setGameState(GAME_READY); setBoard(GenerateBoard(width, height, bombCount))}}/>
    </>
  );
}

export default MinesweeperGame
