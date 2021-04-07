import { Board } from "./board";

const board = new Board();

board.initialize();

const MAX_MOVES = 10;
let moveCount = 0;

console.log(board.toString());

while (moveCount++ < MAX_MOVES) {
  console.log("\n");
  const possibleMoves = board.possibleMoves();
  if (!possibleMoves.length) {
    console.log("no moves left");
    break;
  }
  const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  console.log(`Random move ${moveCount}: ${move}`);
  move.play();
  console.log(board.toString());

  board.nextTurn();
}
