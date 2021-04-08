import { Move } from "./move";
import { Piece } from "./piece";
import { Position } from "./position";
import { Color, PieceType, SideComponent, Visitor } from "./types";

export class Side implements SideComponent {
  readonly color: Color;
  readonly pieces: readonly Piece[];

  private constructor(color: Color, pieces: readonly Piece[] = []) {
    this.color = color;
    this.pieces = pieces;
  }

  play(move: Move): Side {
    return new Side(
      this.color,
      this.pieces.map((piece) => {
        if (move.piece === piece) {
          return piece.with(move.to, move.promote);
        } else if (move.capturePiece === piece) {
          return piece.with(Position.NULL);
        } else if (move.castle === piece && move.castleTo) {
          return piece.with(move.castleTo);
        } else {
          return piece;
        }
      })
    );
  }

  accept(visitor: Visitor) {
    visitor.visitSide(this);
  }

  toString() {
    return `${this.color}`;
  }

  static createSide(color: Color) {
    const rank1 = color === Color.White ? 0 : 7;
    const rank2 = color === Color.White ? 1 : 6;

    return new Side(color, [
      Piece.createPiece(color, PieceType.Rook, 0, rank1),
      Piece.createPiece(color, PieceType.Knight, 1, rank1),
      Piece.createPiece(color, PieceType.Bishop, 2, rank1),
      Piece.createPiece(color, PieceType.Queen, 3, rank1),
      Piece.createPiece(color, PieceType.King, 4, rank1),
      Piece.createPiece(color, PieceType.Bishop, 5, rank1),
      Piece.createPiece(color, PieceType.Knight, 6, rank1),
      Piece.createPiece(color, PieceType.Rook, 7, rank1),
      Piece.createPiece(color, PieceType.Pawn, 0, rank2),
      Piece.createPiece(color, PieceType.Pawn, 1, rank2),
      Piece.createPiece(color, PieceType.Pawn, 2, rank2),
      Piece.createPiece(color, PieceType.Pawn, 3, rank2),
      Piece.createPiece(color, PieceType.Pawn, 4, rank2),
      Piece.createPiece(color, PieceType.Pawn, 5, rank2),
      Piece.createPiece(color, PieceType.Pawn, 6, rank2),
      Piece.createPiece(color, PieceType.Pawn, 7, rank2),
    ]);
  }
}
