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
  }
}

const game = new Game();
game.play();
