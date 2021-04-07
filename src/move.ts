import { Position } from "./position";
import { PieceComponent, PieceType } from "./types";

export class Move {
  readonly piece: PieceComponent;
  readonly to: Position;
  readonly capturePiece?: PieceComponent;
  readonly promote?: typeof Move.PROMOTE_TYPES[number];
  readonly castle?: PieceComponent;
  readonly castleTo?: Position;

  constructor(
    piece: PieceComponent,
    to: Position,
    capturePiece?: PieceComponent,
    promote?: typeof Move.PROMOTE_TYPES[number],
    castle?: PieceComponent,
    castleTo?: Position
  ) {
    this.piece = piece;
    this.to = to;
    this.capturePiece = capturePiece;
    this.promote = promote;
    this.castle = castle;
    this.castleTo = castleTo;
  }

  toString() {
    return [
      this.piece,
      this.piece.position,
      this.to,
      this.promote && `(${this.promote})`,
      this.capturePiece && `x ${this.capturePiece}`,
      this.castle && "castle",
    ]
      .filter(Boolean)
      .join(" ");
  }

  static PROMOTE_TYPES = [
    PieceType.Queen,
    PieceType.Bishop,
    PieceType.Knight,
    PieceType.Rook,
  ] as const;
}
