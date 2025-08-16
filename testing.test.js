const { Ship } = require("./battleship");
test("Ship test", () => {
  const ship = Ship(3); // Create an instance of Ship with length 3
  ship.hit();
  expect(ship.isSunk()).toBe(false);

  ship.hit();
  expect(ship.isSunk()).toBe(false);

  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
