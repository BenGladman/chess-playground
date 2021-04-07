import { Piece } from "./piece";
import { Position } from "./position";
import { Color, PieceType, SideComponent, Visitor } from "./types";

export class Side implements SideComponent {
  readonly color: Color;
  readonly pieces: readonly Piece[];

  constructor(color: Color) {
    this.color = color;

    const rank1 = color === Color.White ? 0 : 7;
    const rank2 = color === Color.White ? 1 : 6;

    this.pieces = [
      new Piece(color, PieceType.Rook, new Position(0, rank1)),
      new Piece(color, PieceType.Knight, new Position(1, rank1)),
      new Piece(color, PieceType.Bishop, new Position(2, rank1)),
      new Piece(color, PieceType.Queen, new Position(3, rank1)),
      new Piece(color, PieceType.King, new Position(4, rank1)),
      new Piece(color, PieceType.Bishop, new Position(5, rank1)),
      new Piece(color, PieceType.Knight, new Position(6, rank1)),
      new Piece(color, PieceType.Rook, new Position(7, rank1)),
      new Piece(color, PieceType.Pawn, new Position(0, rank2)),
      new Piece(color, PieceType.Pawn, new Position(1, rank2)),
      new Piece(color, PieceType.Pawn, new Position(2, rank2)),
      new Piece(color, PieceType.Pawn, new Position(3, rank2)),
      new Piece(color, PieceType.Pawn, new Position(4, rank2)),
      new Piece(color, PieceType.Pawn, new Position(5, rank2)),
      new Piece(color, PieceType.Pawn, new Position(6, rank2)),
      new Piece(color, PieceType.Pawn, new Position(7, rank2)),
    ];
  }

  accept(visitor: Visitor) {
    visitor.visitSide(this);
  }

  toString() {
    return `${this.color}`;
  }
}
