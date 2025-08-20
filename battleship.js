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

function playGame(userObj, computerObj) {
  let activePlayer = userObj;
  let opponent = computerObj;

  const switchPlayerTurn = () => {
    [activePlayer, opponent] = [opponent, activePlayer];
  };

  const getCurrentPlayer = () => activePlayer;
  const getOpponent = () => opponent;

  const playRound = (row, col) => {
    // If it's the computer's turn, generate random coordinates
    if (activePlayer.isComputer) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    }

    const result = activePlayer.attack(opponent, row, col);

    const response = {
      attacker: activePlayer.name,
      row,
      col,
      status: result.status,
      shipSunk: !!result.shipSunk,
      allShipsSunk: !!result.allShipsSunk,
      winner: result.allShipsSunk ? activePlayer.name : null,
    };

    if (!result.allShipsSunk) {
      switchPlayerTurn();
    }

    return response;
  };

  return {
    playRound,
    getCurrentPlayer,
    getOpponent,
  };
}

function displayController() {
  // Convert HTML into DOM elements
  const winnerDiv = document.querySelector(".winnerDiv");
  const announceWinner = document.createElement("h1");
  announceWinner.classList = "announceWinner";

  const turnPlayer = document.querySelector(".turnPlayer");
  const userBoard = document.querySelector(".userBoard");
  const computerBoard = document.querySelector(".computerBoard");

  const shipStatus = document.querySelector(".shipDestroyed");

  // Start the game
  // playGame(userPlayer, computerPlayer);

  const userPlayer = Player("User", false);
  const computerPlayer = Player("Computer", true);

  // Populate both boards
  populateBoardWithShips(computerPlayer.getGameboard());
  populateBoardWithShips(userPlayer.getGameboard());

  // Show boards in console at the start
  logBoards(userPlayer, computerPlayer);

  // Start the game
  const game = playGame(userPlayer, computerPlayer);

  let gameOver = false;
  function updateScreen() {
    // Clear both boards
    userBoard.textContent = "";
    computerBoard.textContent = "";

    // Get updated board states
    const userDisplay = printDisplayBoard(
      userPlayer.getGameboard().getBoard(),
      false
    );
    const computerDisplay = printDisplayBoard(
      computerPlayer.getGameboard().getBoard(),
      true
    );

    // Show current turn
    const activePlayer = game.getCurrentPlayer();
    turnPlayer.textContent = `It's ${activePlayer.name}'s turn`;

    // Render user board
    userDisplay.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const btn = document.createElement("button");
        btn.classList = "grid";
        btn.textContent = cellValue;
        if (cellValue === ".") {
          btn.style.backgroundColor = "white";
          btn.style.color = "white";
        } else if (cellValue === "O") {
          btn.style.backgroundColor = "#8BB4FF";
          btn.style.color = "red";
        } else if (cellValue === "X") {
          btn.style.backgroundColor = "#CFE3FF";
          btn.style.color = "#B2B3BD";
        } else if (cellValue === "S") {
          btn.style.backgroundColor = "#8BB4FF";
          btn.style.color = "#0C162E";
        }

        userBoard.appendChild(btn);
      });
    });

    // Render computer board with event listeners for attacks
    computerDisplay.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const btn = document.createElement("button");
        btn.classList = "grid";
        btn.textContent = cellValue;
        btn.dataset.row = rowIndex;
        btn.dataset.col = colIndex;

        if (cellValue === ".") {
          btn.style.backgroundColor = "white";
          btn.style.color = "white";
        } else if (cellValue === "O") {
          btn.style.backgroundColor = "#8BB4FF";
          btn.style.color = "red";
        } else if (cellValue === "X") {
          btn.style.backgroundColor = "#CFE3FF";
          btn.style.color = "#B2B3BD";
        } else if (cellValue === "S") {
          btn.style.backgroundColor = "#8BB4FF";
          btn.style.color = "#0C162E";
        }

        if (!gameOver && activePlayer.name === "User") {
          btn.addEventListener("click", () => {
            const result = game.playRound(rowIndex, colIndex);

            if (result.status === "Already hit") {
              announceWinner.textContent = `${result.attacker} wins!`;
              return;
            }

            if (result.allShipsSunk) {
              winnerDiv.appendChild(announceWinner);
              announceWinner.textContent = `${result.attacker} wins!`;
              gameOver = true;
            }

            updateScreen(); // Re-render after action
          });
        }

        computerBoard.appendChild(btn);
      });
    });

    // Automatically let computer play after user
    if (!gameOver && game.getCurrentPlayer().isComputer) {
      setTimeout(() => {
        const result = game.playRound();

        if (result.allShipsSunk) {
          winnerDiv.appendChild(announceWinner);
          announceWinner.textContent = `${result.attacker} wins!`;
          gameOver = true;
        }

        updateScreen(); // Render after computer's turn
      }, 500); // slight delay for visual clarity
    }
  }

  updateScreen();
}

// HELPER
function printDisplayBoard(board, hideShips = false) {
  const display = board.map((row) =>
    row.map((cell) => {
      if (cell.hit && cell.ship) return "O"; // Hit ship
      if (cell.hit && !cell.ship) return "X"; // Miss
      if (!cell.hit && cell.ship) return hideShips ? "." : "S"; // Unhit ship
      return "."; // Empty cell
    })
  );

  //display.forEach((row) => console.log(row));

  return display;
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

// HELPER

function logBoards(user, computer) {
  console.log("User:");
  printDisplayBoard(user.getGameboard().getBoard(), false).forEach((row) =>
    console.log(row.join(" "))
  );

  console.log("\nComputer:");
  printDisplayBoard(computer.getGameboard().getBoard(), false).forEach((row) =>
    console.log(row.join(" "))
  );

  console.log("----------");
}

displayController();

module.exports = {
  Ship,
  Gameboard,
  Player,
  playGame,
};
