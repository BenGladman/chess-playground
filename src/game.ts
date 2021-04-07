import { Board } from "./board";
import { BoardStatus } from "./board-status";
import { Printer } from "./printer";

class Game {
  board = new Board();
  boardStatus = new BoardStatus(this.board);

  print() {
    const printer = new Printer();
    this.board.accept(printer);
    console.log(printer.toString());
  }

  play() {
    const randomMove = this.boardStatus.possibleMoves[
      Math.floor(Math.random() * this.boardStatus.possibleMoves.length)
    ];
    this.board = this.board.play(randomMove);
    this.boardStatus = new BoardStatus(this.board);
  }

  run() {
    this.print();

    do {
      console.log("\n");
      this.play();
      console.log(
        `Random move #${this.board.moves.length} ${this.board.lastMove} ${this.boardStatus}`
      );
      this.print();
    } while (
      !this.boardStatus.isStaleMate &&
      !this.boardStatus.isCheckMate &&
      this.board.moves.length < 100
    );
  }
}

const game = new Game();
game.run();
