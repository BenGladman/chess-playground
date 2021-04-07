import { Piece, PieceVisitor, Color, PieceName } from "./piece";

const indexes = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export class Printer implements PieceVisitor {
  private board = indexes.map(() => indexes.map(() => " "));
  private whiteTaken: string[] = [];
  private blackTaken: string[] = [];

  visit(piece: Piece) {
    const set = (white: string, black: string) => {
      if (piece._position) {
        this.board[piece._position.rankIndex][piece._position.fileIndex] =
          piece.color === "W" ? white : black;
      } else if (piece.color === "W") {
        this.whiteTaken.push(white);
      } else {
        this.blackTaken.push(black);
      }
    };

    switch (piece.name) {
      case PieceName.King:
        return set("♔", "♚");
      case PieceName.Queen:
        return set("♕", "♛");
      case PieceName.Bishop:
        return set("♗", "♝");
      case PieceName.Knight:
        return set("♘", "♞");
      case PieceName.Rook:
        return set("♖", "♜");
      case PieceName.Pawn:
        return set("♙", "♟");
      default:
        assertUnreachable(piece.name);
    }
  }

  toString() {
    const taken = (ix: number) => {
      if (ix === 0 && this.whiteTaken.length) {
        return `   (${this.whiteTaken.join(" ")})`;
      }
      if (ix === 7 && this.blackTaken.length) {
        return `   (${this.blackTaken.join(" ")})`;
      }
      return "";
    };

    return this.board
      .map((rank, ix) => `${rank.join(" ")}${taken(ix)}`)
      .reverse()
      .join("\n");
  }
}

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}
