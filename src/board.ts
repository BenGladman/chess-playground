import { Move } from "./move";
import { Side } from "./side";
import { BoardComponent, Color, Visitor } from "./types";

export class Board implements BoardComponent {
  white: Side;
  black: Side;
  turn: Color;
  moves: readonly Move[];

  constructor(
    white = Side.create(Color.White),
    black = Side.create(Color.Black),
    turn = Color.White,
    moves: readonly Move[] = []
  ) {
    this.white = white;
    this.black = black;
    this.turn = turn;
    this.moves = moves;
  }

  get lastMove() {
    return this.moves.length > 0 ? this.moves[this.moves.length - 1] : null;
  }

  get nextTurn() {
    return this.turn === Color.White ? Color.Black : Color.White;
  }

  play(move: Move | null) {
    return new Board(
      move ? this.white.play(move) : this.white,
      move ? this.black.play(move) : this.black,
      this.nextTurn,
      move ? this.moves.concat(move) : this.moves
    );
  }

  accept(visitor: Visitor) {
    visitor.visitBoard(this);
  }
}
