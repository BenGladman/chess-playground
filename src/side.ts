import {
  Color,
  Move,
  PieceType,
  Playable,
  SideComponent,
  Visitor,
} from "./core";
import { Piece } from "./piece";

export class Side implements SideComponent, Playable<Side> {
  readonly color: Color;
  readonly pieces: readonly Piece[];

  private constructor(color: Color, pieces: readonly Piece[] = []) {
    this.color = color;
    this.pieces = pieces;
  }

  play(move: Move): Side {
    return new Side(
      this.color,
      this.pieces.map((piece) => piece.play(move))
    );
  }

  accept(visitor: Visitor) {
    visitor.visitSide(this);
  }

  toString() {
    return `${this.color}`;
  }

  static create(color: Color) {
    const rank1 = color === Color.White ? 0 : 7;
    const rank2 = color === Color.White ? 1 : 6;

    return new Side(color, [
      Piece.create(color, PieceType.Rook, 0, rank1),
      Piece.create(color, PieceType.Knight, 1, rank1),
      Piece.create(color, PieceType.Bishop, 2, rank1),
      Piece.create(color, PieceType.Queen, 3, rank1),
      Piece.create(color, PieceType.King, 4, rank1),
      Piece.create(color, PieceType.Bishop, 5, rank1),
      Piece.create(color, PieceType.Knight, 6, rank1),
      Piece.create(color, PieceType.Rook, 7, rank1),
      Piece.create(color, PieceType.Pawn, 0, rank2),
      Piece.create(color, PieceType.Pawn, 1, rank2),
      Piece.create(color, PieceType.Pawn, 2, rank2),
      Piece.create(color, PieceType.Pawn, 3, rank2),
      Piece.create(color, PieceType.Pawn, 4, rank2),
      Piece.create(color, PieceType.Pawn, 5, rank2),
      Piece.create(color, PieceType.Pawn, 6, rank2),
      Piece.create(color, PieceType.Pawn, 7, rank2),
    ]);
  }
}
