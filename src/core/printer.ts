import { Position } from "./position";
import {
  BoardComponent,
  Color,
  PieceComponent,
  SideComponent,
  Visitor,
} from "./types";

const indexes = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export class Printer implements Visitor {
  private board: string[][] = indexes.map((r) =>
    indexes.map((f) => ((f + r) % 2 === 0 ? "░░" : "  "))
  );
  private whiteCaptured: string[] = [];
  private blackCaptured: string[] = [];

  visitBoard(board: BoardComponent) {
    board.sideToPlay.accept(this);
    board.otherSide.accept(this);
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
    if (!piece.position.isNull) {
      this.board[piece.position.rankIndex][piece.position.fileIndex] =
        piece.color === Color.White ? white : black;
    } else if (piece.color === Color.White) {
      this.whiteCaptured.push(white);
    } else {
      this.blackCaptured.push(black);
    }
  }

  toString() {
    const taken = (ix: number) => {
      if (ix === 0 && this.whiteCaptured.length) {
        return `  taken: ${this.whiteCaptured.join("")}`;
      }
      if (ix === 7 && this.blackCaptured.length) {
        return `  taken: ${this.blackCaptured.join("")}`;
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

  static fileLabels = indexes.map((i) => Position.get(i, 0).fileName).join(" ");
  static rankLabels = indexes.map((i) => Position.get(0, i).rankName);
}
