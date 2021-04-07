import { Piece } from "./piece";
import { Position } from "./position";

export class Move {
  piece: Piece;
  from: Position;
  to: Position;
  takePiece?: Piece;

  constructor(piece: Piece, from: Position, to: Position, takePiece?: Piece) {
    this.piece = piece;
    this.from = from;
    this.to = to;
    this.takePiece = takePiece;
  }

  play() {
    this.piece.move(this.to);
    if (this.takePiece) {
      this.takePiece.remove();
    }
  }

  toString() {
    return `${this.piece} ${this.from} ${this.to}`;
  }
}
