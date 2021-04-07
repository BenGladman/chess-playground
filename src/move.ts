import { Position } from "./position";
import { PieceComponent, PieceType } from "./types";

export class Move {
  readonly piece: PieceComponent;
  readonly to: Position;
  readonly takePiece?: PieceComponent;
  readonly promote?:
    | PieceType.Queen
    | PieceType.Bishop
    | PieceType.Knight
    | PieceType.Rook;
  readonly castle?: PieceComponent;

  constructor(
    piece: PieceComponent,
    to: Position,
    takePiece?: PieceComponent,
    promote?:
      | PieceType.Queen
      | PieceType.Bishop
      | PieceType.Knight
      | PieceType.Rook,
    castle?: PieceComponent
  ) {
    this.piece = piece;
    this.to = to;
    this.takePiece = takePiece;
    this.promote = promote;
    this.castle = castle;
  }

  toString() {
    return `${this.piece} ${this.piece.position} ${this.to}`;
  }
}
