const { Ship, Gameboard, Player, playGame } = require("./battleship");
test("Ship test", () => {
  // SHIP TEST
  const ship = Ship(3); // Create an instance of Ship with length 3
  ship.hit();
  expect(ship.isSunk()).toBe(false);

  ship.hit();
  expect(ship.isSunk()).toBe(false);

  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

// GAMEBOARD TESTS
describe("Gameboard", () => {
  test("can place a ship on the board", () => {
    const board = Gameboard();
    const result = board.placeShip(0, 0, 3);
    expect(result).toBe(true);
  });

  test("registers a hit on a ship", () => {
    const board = Gameboard();
    board.placeShip(0, 0, 1);
    const result = board.receiveAttack(0, 0);
    expect(result.status).toBe("Hit");
  });

  test("registers a miss on an empty cell", () => {
    const board = Gameboard();
    const result = board.receiveAttack(5, 5);
    expect(result.status).toBe("Miss");
  });

  test("recognizes when all ships are sunk", () => {
    const board = Gameboard();
    board.placeShip(0, 0, 1);
    board.receiveAttack(0, 0);
    expect(board.areAllShipsSunk()).toBe(true);
  });
});

// PLAYER TESTS
describe("Player", () => {
  test("can attack another player's board", () => {
    const player1 = Player("P1");
    const player2 = Player("P2");
    player2.getGameboard().placeShip(0, 0, 1);

    const result = player1.attack(player2, 0, 0);
    expect(result.status).toBe("Hit");
  });
});

// PLAY GAME TESTS
describe("playGame", () => {
  test("alternates players after a turn", () => {
    const user = Player("User");
    const computer = Player("Computer");
    const game = playGame(user, computer);

    const initialPlayer = game.getCurrentPlayer();
    game.playRound(0, 0);
    const nextPlayer = game.getCurrentPlayer();

    expect(nextPlayer).not.toBe(initialPlayer);
  });

  test("ends the game when all ships are sunk", () => {
    const user = Player("User");
    const computer = Player("Computer");

    // Place only one ship of size 1 to end game quickly
    computer.getGameboard().placeShip(0, 0, 1);

    const game = playGame(user, computer);
    const result = game.playRound(0, 0);

    expect(result.status).toBe("Hit");
    expect(result.allShipsSunk).toBe(true);
    expect(result.winner).toBe("User");
  });
});
