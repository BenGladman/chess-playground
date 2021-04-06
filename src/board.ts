import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from "./piece";
import { PieceSymbol } from "./piece-symbol";
import { Position, RankFileIndex } from "./position";

const indexes = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export class Board {
  positions: readonly Position[];
  pieces: Piece[] = [];

  constructor() {
    this.positions = indexes.flatMap((rankIndex) =>
      indexes.map((fileIndex) => new Position(fileIndex, rankIndex))
    );
  }

  getPosition(fileIndex: RankFileIndex, rankIndex: RankFileIndex) {
    const position = this.positions.find(
      (p) => p.fileIndex === fileIndex && p.rankIndex === rankIndex
    );
    if (!position) {
      throw new Error("Position not found on board");
    }
    return position;
  }

  initialize() {
    for (const [color, rankIndex, pawnRankIndex] of [
      ["W", 0, 1],
      ["B", 7, 6],
    ] as const) {
      this.pieces.push(new Rook(color, this.getPosition(0, rankIndex)));
      this.pieces.push(new Knight(color, this.getPosition(1, rankIndex)));
      this.pieces.push(new Bishop(color, this.getPosition(2, rankIndex)));
      this.pieces.push(new Queen(color, this.getPosition(3, rankIndex)));
      this.pieces.push(new King(color, this.getPosition(4, rankIndex)));
      this.pieces.push(new Bishop(color, this.getPosition(5, rankIndex)));
      this.pieces.push(new Knight(color, this.getPosition(6, rankIndex)));
      this.pieces.push(new Rook(color, this.getPosition(7, rankIndex)));

      for (const fileIndex of indexes) {
        this.pieces.push(
          new Pawn(color, this.getPosition(fileIndex, pawnRankIndex))
        );
      }
    }
  }

  toString() {
    const board: string[][] = [[], [], [], [], [], [], [], []];
    for (const position of this.positions) {
      const piece = this.pieces.find((p) => p.position === position);
      const symbolVisitor = new PieceSymbol();
      if (piece) {
        piece.accept(symbolVisitor);
      }
      board[position.rankIndex][position.fileIndex] = symbolVisitor.toString();
    }

    return board
      .map((rank) => rank.join(""))
      .reverse()
      .join("\n");
  }
}
