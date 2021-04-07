import { Position } from "./position";
import { PieceComponent, PieceType } from "./types";

export class Move {
  readonly piece: PieceComponent;
  readonly to: Position;
  readonly capturePiece?: PieceComponent;
  readonly promote?: typeof Move.PROMOTE_TYPES[number];
  readonly castle?: PieceComponent;

  constructor(
    piece: PieceComponent,
    to: Position,
    capturePiece?: PieceComponent,
    promote?: typeof Move.PROMOTE_TYPES[number],
    castle?: PieceComponent
  ) {
    this.piece = piece;
    this.to = to;
    this.capturePiece = capturePiece;
    this.promote = promote;
    this.castle = castle;
  }

  toString() {
    return [
      this.piece,
      this.piece.position,
      this.to,
      this.capturePiece ? `x ${this.capturePiece}` : "",
    ].join(" ");
  }

  static PROMOTE_TYPES = [
    PieceType.Queen,
    PieceType.Bishop,
    PieceType.Knight,
    PieceType.Rook,
  ] as const;
}
