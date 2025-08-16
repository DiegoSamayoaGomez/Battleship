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
module.exports = { Ship };
