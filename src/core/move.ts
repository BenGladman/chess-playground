import { Position } from "./position";
import { PieceComponent, PieceType } from "./types";

export class Move {
  readonly piece: PieceComponent;
  readonly to: Position;
  readonly capturePiece?: PieceComponent;
  readonly promoteTo?: typeof Move.PROMOTE_TO_TYPES[number];
  readonly castle?: PieceComponent;
  readonly castleTo?: Position;

  constructor(
    piece: PieceComponent,
    to: Position,
    capturePiece?: PieceComponent,
    promoteTo?: typeof Move.PROMOTE_TO_TYPES[number],
    castle?: PieceComponent,
    castleTo?: Position
  ) {
    this.piece = piece;
    this.to = to;
    this.capturePiece = capturePiece;
    this.promoteTo = promoteTo;
    this.castle = castle;
    this.castleTo = castleTo;
  }

  toString() {
    return [
      this.piece,
      this.piece.position,
      this.to,
      this.promoteTo && `(${this.promoteTo})`,
      this.capturePiece && `x ${this.capturePiece}`,
      this.castle && "castle",
    ]
      .filter(Boolean)
      .join(" ");
  }

  static PROMOTE_TO_TYPES = [
    PieceType.Queen,
    PieceType.Bishop,
    PieceType.Knight,
    PieceType.Rook,
  ] as const;
}
