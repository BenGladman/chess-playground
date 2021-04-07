import { Side } from "./side";
import { Color, BoardComponent, Visitor } from "./types";

export class Board implements BoardComponent {
  white = new Side(Color.White);
  black = new Side(Color.Black);

  turn = this.white;

  nextTurn() {
    this.turn = this.turn === this.white ? this.black : this.white;
  }

  accept(visitor: Visitor) {
    visitor.visitBoard(this);
  }
}
