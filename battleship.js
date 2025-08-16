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

  // Track all placed ships
  const ships = [];
  // Create 2D array that will represent the state of the game board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = { ship: null, hit: false };
    }
  }

  // Place the ship in the board (populate the board based on the size of the ship)
  const applyShip = (row, col, size, dr, dc, ship) => {
    for (let i = 0; i < size; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      board[r][c].ship = ship;
    }
    ships.push(ship); // Track the ship
  };

  // Check if the row column coordinate is empty
  const isAreaClear = (r, c) => {
    for (let i = r - 1; i <= r + 1; i++) {
      for (let j = c - 1; j <= c + 1; j++) {
        if (
          i >= 0 &&
          i < rows &&
          j >= 0 &&
          j < columns &&
          board[i][j].ship !== null
        ) {
          return false;
        }
      }
    }
    return true;
  };

  // Check if ship can be placed in a given direction
  const canPlaceShip = (row, col, size, dr, dc) => {
    for (let i = 0; i < size; i++) {
      const r = row + dr * i;
      const c = col + dc * i;

      // Check if the row column is not out of bounds or if the coordinate is empty
      if (r < 0 || r >= rows || c < 0 || c >= columns || !isAreaClear(r, c)) {
        return false;
      }
    }
    return true;
  };

  // Check if the ship fits in a valid direction
  const placeShip = (row, column, sizeOfShip) => {
    const directions = [
      [-1, 0], // UP
      [0, 1], // RIGHT
      [1, 0], // DOWN
      [0, -1], // LEFT
    ];
    // Create new ship instance
    const ship = Ship(sizeOfShip);

    // Iterate over the possible combination of directions
    for (let [dr, dc] of directions) {
      // Check if the ship fits in the given position
      if (canPlaceShip(row, column, sizeOfShip, dr, dc)) {
        // If valid, place the ship
        applyShip(row, column, sizeOfShip, dr, dc, ship);
        return true; // Ship placed successfully
      }
    }

    return false; // No valid placement
  };

  const receiveAttack = (row, col) => {
    const cell = board[row][col];

    if (cell.hit) return "Already hit";

    cell.hit = true;

    if (cell.ship) {
      cell.ship.hit();
      cell.display = "O"; // Mark hit ship with "O"
      return cell.ship.isSunk() ? "Hit and sunk!" : "Hit!";
    } else {
      cell.display = "X"; // Optional: mark miss with "X"
      return "Miss!";
    }
  };

  // Retrieve the current gameboard
  const getBoard = () => board;
  const getShips = () => ships;

  return { getBoard, placeShip, receiveAttack, getShips };
}

function printDisplayBoard(board) {
  const display = board.map((row) =>
    row.map((cell) => {
      if (cell.hit && cell.ship) return "O"; // Hit ship
      if (cell.hit && !cell.ship) return "X"; // Miss
      if (!cell.hit && cell.ship) return "S"; // Unhit ship
      return " "; // Empty cell
    })
  );

  display.forEach((row) => console.log(row));
}
//module.exports = { Ship };

const game = Gameboard();
//game.placeShip(5, 3, 4);
//game.placeShip(2, 5, 4);
//game.placeShip(0, 9, 4);
game.placeShip(3, 3, 2);

console.log(game.receiveAttack(3, 3)); // => "Hit!"
console.log(game.receiveAttack(2, 3)); // => "Miss!" (unless ship was placed to the right)
console.log("--->", game.getShips());
printDisplayBoard(game.getBoard());
