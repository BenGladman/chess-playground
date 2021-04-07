import { Bishop, Color, King, Knight, Pawn, Piece, Queen, Rook } from "./piece";
import { Position } from "./position";
import { PossibleMoves } from "./possible-moves";
import { Printer } from "./printer";

const indexes = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export class Board {
  pieces: Piece[] = [];
  turn: Color = "W";

  initialize() {
    this.turn = "W";

    for (const [color, rankIndex, pawnRankIndex] of [
      ["W", 0, 1],
      ["B", 7, 6],
    ] as const) {
      this.pieces.push(new Rook(color, new Position(0, rankIndex)));
      this.pieces.push(new Knight(color, new Position(1, rankIndex)));
      this.pieces.push(new Bishop(color, new Position(2, rankIndex)));
      this.pieces.push(new Queen(color, new Position(3, rankIndex)));
      this.pieces.push(new King(color, new Position(4, rankIndex)));
      this.pieces.push(new Bishop(color, new Position(5, rankIndex)));
      this.pieces.push(new Knight(color, new Position(6, rankIndex)));
      this.pieces.push(new Rook(color, new Position(7, rankIndex)));

      for (const fileIndex of indexes) {
        this.pieces.push(
          new Pawn(color, new Position(fileIndex, pawnRankIndex))
        );
      }
    }
  }

  possibleMoves() {
    const movesVistor = new PossibleMoves(this.pieces);
    this.pieces.forEach(
      (piece) => piece.color === this.turn && piece.accept(movesVistor)
    );
    return movesVistor.moves;
  }

  nextTurn() {
    this.turn = this.turn === "B" ? "W" : "B";
  }

  toString() {
    const printerVisitor = new Printer();
    this.pieces.forEach((piece) => piece.accept(printerVisitor));
    return printerVisitor.toString();
  }
}
