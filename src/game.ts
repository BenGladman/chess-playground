import { Board } from "./board";
import { PossibleMoves } from "./possible-moves";
import { Printer } from "./printer";
import { PieceType } from "./types";

class Game {
  board = new Board();

  print() {
    const printer = new Printer();
    this.board.accept(printer);
    console.log(printer.toString());
  }

  play() {
    this.print();

    while (
      this.board.possibleMoves.length > 0 &&
      this.board.moves.length < 30
    ) {
      console.log("\n");
      const randomMove = this.board.possibleMoves[
        Math.floor(Math.random() * this.board.possibleMoves.length)
      ];
      console.log(`Random move #${this.board.moves.length + 1} ${randomMove}`);
      this.board = this.board.play(randomMove);
      this.print();
    }
  }
}

const game = new Game();
game.play();
