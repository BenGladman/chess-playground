import { Position } from "./position";
import { PieceComponent } from "./types";

export class Move {
  readonly piece: PieceComponent;
  readonly from: Position;
  readonly to: Position;
  readonly takePiece?: PieceComponent;

  constructor(
    piece: PieceComponent,
    from: Position,
    to: Position,
    takePiece?: PieceComponent
  ) {
    this.piece = piece;
    this.from = from;
    this.to = to;
    this.takePiece = takePiece;
  }

  play() {
    this.piece.position = this.to;
    if (this.takePiece) {
      this.takePiece.position = Position.NULL;
    }
  }

  toString() {
    return `${this.piece} ${this.from} ${this.to}`;
  }
}
