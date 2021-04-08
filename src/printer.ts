import { Position } from "./position";
import {
  BoardComponent,
  Color,
  PieceComponent,
  PieceType,
  SideComponent,
  Visitor,
} from "./types";

const indexes = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export class Printer implements Visitor {
  private board: string[][] = indexes.map((r) =>
    indexes.map((f) => ((f + r) % 2 === 0 ? "░░" : "  "))
  );
  private whiteTaken: string[] = [];
  private blackTaken: string[] = [];

  visitBoard(board: BoardComponent) {
    board.white.accept(this);
    board.black.accept(this);
  }

  visitSide(side: SideComponent) {
    for (const piece of side.pieces) {
      piece.accept(this);
    }
  }

  visitKing(piece: PieceComponent) {
    this.setPiece(piece, "♔ ", "♚ ");
  }

  visitQueen(piece: PieceComponent) {
    this.setPiece(piece, "♕ ", "♛ ");
  }

  visitBishop(piece: PieceComponent) {
    this.setPiece(piece, "♗ ", "♝ ");
  }

  visitKnight(piece: PieceComponent) {
    this.setPiece(piece, "♘ ", "♞ ");
  }

  visitRook(piece: PieceComponent) {
    this.setPiece(piece, "♖ ", "♜ ");
  }

  visitPawn(piece: PieceComponent) {
    this.setPiece(piece, "♙ ", "♟ ");
  }

  private setPiece(piece: PieceComponent, white: string, black: string) {
    if (!piece.position.null) {
      this.board[piece.position.rankIndex][piece.position.fileIndex] =
        piece.color === Color.White ? white : black;
    } else if (piece.color === Color.White) {
      this.whiteTaken.push(white);
    } else {
      this.blackTaken.push(black);
    }
  }

  toString() {
    const taken = (ix: number) => {
      if (ix === 0 && this.whiteTaken.length) {
        return `  taken: ${this.whiteTaken.join("")}`;
      }
      if (ix === 7 && this.blackTaken.length) {
        return `  taken: ${this.blackTaken.join("")}`;
      }
      return "";
    };

    return this.board
      .map(
        (rank, ix) => `${Printer.rankLabels[ix]} ${rank.join("")}${taken(ix)}`
      )
      .reverse()
      .concat(`  ${Printer.fileLabels}`)
      .join("\n");
  }

  static fileLabels = indexes.map((i) => new Position(i, 0).fileName).join(" ");
  static rankLabels = indexes.map((i) => new Position(0, i).rankName);
}
