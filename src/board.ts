import { BoardStatus } from "./board-status";
import { BoardComponent, Color, Move, Printer, Visitor } from "./core";
import { Side } from "./side";

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

  _status?: BoardStatus;

  get status(): BoardStatus {
    if (this._status === undefined) {
      this._status = BoardStatus.create(this);
    }
    return this._status;
  }

  print() {
    const printer = new Printer();
    this.accept(printer);
    console.log(printer.toString());
  }

  accept(visitor: Visitor) {
    visitor.visitBoard(this);
  }
}
