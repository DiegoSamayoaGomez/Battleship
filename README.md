# Battleship

Implementation of the famous game battleship with the use of Test Driven Development TDD with `Jest` for unit testing

The porpuse of this project is build robust and testable code using TDD

## Features

- Automatically create and place ships that track hits and wheter they are sunk
- Players take turns attacking each other´s boards
- Game ends when one player’s ships are all sunk
- Basic computer AI (random, legal moves)

## Testing

- Jest is used for unit testing (with Babel for ES Modules)
- All logic (ships, boards, attacks) is tested
- DOM is not tested

## How to play

- Clone the repo and run `npm install`
- Run tests with `npm test`
- Open `index.html` in a browser to start the game