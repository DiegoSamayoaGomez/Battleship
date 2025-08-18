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

    if (cell.hit) return { status: "Already hit" };

    cell.hit = true;

    if (cell.ship) {
      cell.ship.hit();
      const shipSunk = cell.ship.isSunk();
      const allSunk = areAllShipsSunk();

      return {
        status: "Hit",
        shipSunk,
        allShipsSunk: allSunk,
      };
    } else {
      return { status: "Miss" };
    }
  };
  const areAllShipsSunk = () => {
    return ships.every((ship) => ship.isSunk());
  };

  // Retrieve the current gameboard
  const getBoard = () => board;
  // Retrieve all existing ships
  const getShips = () => ships;

  // Gameboard
  return { getBoard, placeShip, receiveAttack, getShips, areAllShipsSunk };
}

function Player(name = "Player", isComputer = false) {
  const gameboard = Gameboard();

  const attack = (opponent, row, col) => {
    return opponent.getGameboard().receiveAttack(row, col);
  };

  const getGameboard = () => gameboard;

  return {
    name,
    isComputer,
    attack,
    getGameboard,
  };
}

function playGame(user, computer) {
  let activePlayer = user;
  let opponent = computer;

  while (true) {
    console.log(`\n${activePlayer.name}'s turn:`);

    let row, col;

    if (activePlayer.isComputer) {
      // Random attack
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    } else {
      // User input — Later will be replaced with UI
      row = parseInt(prompt("Enter row (0–9): "));
      col = parseInt(prompt("Enter col (0–9): "));
    }

    const result = activePlayer.attack(opponent, row, col);

    console.log(`Attack on (${row}, ${col}): ${result.status}`);
    if (result.status === "Hit" && result.shipSunk) {
      console.log("You sunk a ship!");
    }

    console.log(`\n${opponent.name}'s board:`);
    printDisplayBoard(opponent.getGameboard().getBoard());

    if (result.allShipsSunk) {
      console.log(`\n ${activePlayer.name} wins! All opponent ships sunk.`);
      break;
    }

    // Switch turns
    [activePlayer, opponent] = [opponent, activePlayer];
  }
}

// HELPER
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

// HELPER
function populateBoardWithShips(gameboard) {
  const shipsToPlace = [
    { name: "Carrier", size: 5 },
    { name: "Battleship", size: 4 },
    { name: "Destroyer", size: 3 },
    { name: "Submarine", size: 3 },
    { name: "Patrol Boat", size: 2 },
  ];

  for (const ship of shipsToPlace) {
    let placed = false;

    while (!placed) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      placed = gameboard.placeShip(row, col, ship.size);
    }
  }
}
/* 
const playerOne = Player();
playerOne.placeShip(2, 3, 1);
console.log(playerOne.receiveAttack(2, 3));
console.log(printDisplayBoard(playerOne.getBoard()));

const Two = Player();
Two.placeShip(3, 3, 1);
console.log(Two.receiveAttack(3, 3));
console.log(printDisplayBoard(Two.getBoard()));

const instance = Gameboard();
//populateBoardWithShips(instance);
instance.placeShip(2, 3, 1);
instance.receiveAttack(2, 3);

console.log(printDisplayBoard(instance.getBoard()));

*/
const computerPlayer = Player("Computer", true);
const userPlayer = Player("User", false);

// Populate both boards
populateBoardWithShips(computerPlayer.getGameboard());
populateBoardWithShips(userPlayer.getGameboard());

// Start the game
// playGame(userPlayer, computerPlayer);
