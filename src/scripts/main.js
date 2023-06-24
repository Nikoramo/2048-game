'use strict';

const rows = document.querySelectorAll('tr');
const mainButton = document.querySelector('button');
const gameScore = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMassage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const ArrowLeft = 'ArrowLeft';
const ArrowRight = 'ArrowRight';
const ArrowUp = 'ArrowUp';
const ArrowDown = 'ArrowDown';

let gameStatus;
let board;
let score = 0;
const maxRows = rows.length;
const maxColumns = maxRows;

mainButton.addEventListener('click', () => {
  mainButton.classList.remove('start');
  mainButton.classList.add('restart');
  mainButton.innerText = 'Restart';

  startMessage.classList.add('hidden');
  winMassage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  score = 0;
  gameScore.innerText = score;
  gameStatus = true;

  startGame();
});

function hasEmptyCell() {
  for (let x = 0; x < maxRows; x++) {
    for (let y = 0; y < maxColumns; y++) {
      if (board[x][y] === 0) {
        return true;
      }
    }
  }

  return false;
}

function generateRandomTile(quantity) {
  if (!hasEmptyCell()) {
    loseMessage.classList.remove('hidden');
    gameStatus = false;

    return;
  }

  let emptyCellCount = 0;

  while (emptyCellCount < quantity) {
    const x = Math.floor(Math.random() * maxRows);
    const y = Math.floor(Math.random() * maxColumns);

    const newCell = 0;
    const newValueProbability = 0.9;
    const newValue2 = 2;
    const newValue4 = 4;

    if (board[x][y] === newCell) {
      const newValue = Math.random() < newValueProbability
        ? newValue2 : newValue4;

      board[x][y] = newValue;

      const tile = document.getElementById(`${x}-${y}`);

      tile.innerText = newValue;
      tile.classList.add(`field-cell--${newValue}`);
      emptyCellCount++;
    }
  }
}

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  rows.forEach((row, rowIndex) => {
    [...row.children].forEach((cell, cellIndex) => {
      cell.id = `${rowIndex}-${cellIndex}`;

      const value = board[rowIndex][cellIndex];

      updateTile(cell, value);
    });
  });

  generateRandomTile(2);
}

function updateTile(element, value) {
  const winValue = 2048;

  element.innerText = '';
  element.classList.value = '';
  element.classList.add('field-cell');

  if (value > 0) {
    element.classList.add(`field-cell--${value}`);
    element.innerText = value;
  }

  if (value === winValue) {
    winMassage.classList.remove('hidden');
    gameStatus = false;
  }
}

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (!gameStatus) {
    return;
  }

  switch (e.code) {
    case ArrowLeft:
      moveLeft();
      break;

    case ArrowRight:
      moveRight();
      break;

    case ArrowUp:
      moveUp();
      break;

    case ArrowDown:
      moveDown();
      break;

    default:
      return;
  }

  generateRandomTile(1);
});

function removeZero(row) {
  return row.filter(number => number !== 0);
}

function move(row) {
  let newRow = removeZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;

      score += newRow[i];

      gameScore.innerText = score;
    }
  }

  newRow = removeZero(newRow);

  while (newRow.length < maxRows) {
    newRow.push(0);
  }

  return newRow;
}

function updateTilesInRow(x) {
  for (let y = 0; y < maxColumns; y++) {
    const tile = document.getElementById(`${x}-${y}`);
    const value = board[x][y];

    updateTile(tile, value);
  }
}

function moveLeft() {
  for (let x = 0; x < maxRows; x++) {
    const row = board[x];
    const movingRow = move(row);

    board[x] = movingRow;
    updateTilesInRow(x);
  }
}

function moveRight() {
  for (let x = 0; x < maxRows; x++) {
    const row = board[x].reverse();
    const movingRow = move(row);

    board[x] = movingRow.reverse();

    updateTilesInRow(x);
  }
}

function moveUp() {
  for (let y = 0; y < maxColumns; y++) {
    const column = [board[0][y], board[1][y], board[2][y], board[3][y]];
    const movingColumn = move(column);

    for (let x = 0; x < maxRows; x++) {
      board[x][y] = movingColumn[x];

      const tile = document.getElementById(`${x}-${y}`);
      const value = board[x][y];

      updateTile(tile, value);
    }
  }
}

function moveDown() {
  for (let y = 0; y < maxColumns; y++) {
    const row = [board[0][y], board[1][y], board[2][y], board[3][y]].reverse();
    const movingRow = move(row).reverse();

    for (let x = 0; x < maxRows; x++) {
      board[x][y] = movingRow[x];

      const tile = document.getElementById(`${x}-${y}`);
      const value = board[x][y];

      updateTile(tile, value);
    }
  }
}
