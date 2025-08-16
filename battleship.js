function Ship(length) {
  let hits = 0;
  let sunk = false;

  // Increase the number of the variable each time the
  // ship has been hit
  const hit = () => {
    if (hits < length) {
      hits++;
    }
  };

  // Calculate wheter a ship is considered sunk
  const isSunk = () => {
    return hits >= length;
  };

  return {
    hit,
    isSunk,
  };
}

function Gameboard() {
  const rows = 10;
  const columns = 10;
  const board = [];

  // Create 2D array that will represent the state of the game board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = "-";
    }
  }

  // Retrieve the current gameboard
  const getBoard = () => board;

  // Place the ship in the board
  const applyShip = (row, col, size) => {
    for (let i = 0; i < size; i++) {
      const r = row + 3;
      const c = col + 3;
      board[r][c] = "S"; // S for Ship
    }
  };

  return { getBoard, applyShip };
}

// This functions should be passed to a test
//const ship = Ship;
/*
ship.hit();
console.log(ship.isSunk()); // false
ship.hit();
console.log(ship.isSunk()); // false
ship.hit();
console.log(ship.isSunk()); // true
 */
//module.exports = { Ship };

const game = Gameboard();
game.applyShip(5, 5, 3);
console.table(game.getBoard());
