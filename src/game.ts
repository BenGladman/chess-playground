import { Board } from "./board";
import { Printer } from "./core";

class Game {
  board = Board.create();

  play() {
    const possibleMoves = this.board.possibleMoves;
    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    this.board = this.board.play(randomMove);
  }

  print() {
    const printer = new Printer();
    this.board.accept(printer);
    console.log(printer.toString());
  }

  run() {
    this.print();

    do {
      console.log("\n");
      this.play();
      console.log(
        `Random move #${this.board.moves.length} ${this.board.lastMove} ${this.board}`
      );
      this.print();
    } while (
      !this.board.isStaleMate &&
      !this.board.isCheckMate &&
      this.board.moves.length < 300
    );
  }
}

const game = new Game();
game.run();
