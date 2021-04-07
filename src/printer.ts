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
  private board = indexes.map(() => indexes.map(() => " "));
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

  visitPiece(piece: PieceComponent) {
    const set = (white: string, black: string) => {
      if (!piece.position.null) {
        this.board[piece.position.rankIndex][piece.position.fileIndex] =
          piece.color === Color.White ? white : black;
      } else if (piece.color === Color.White) {
        this.whiteTaken.push(white);
      } else {
        this.blackTaken.push(black);
      }
    };

    switch (piece.type) {
      case PieceType.King:
        return set("♔", "♚");
      case PieceType.Queen:
        return set("♕", "♛");
      case PieceType.Bishop:
        return set("♗", "♝");
      case PieceType.Knight:
        return set("♘", "♞");
      case PieceType.Rook:
        return set("♖", "♜");
      case PieceType.Pawn:
        return set("♙", "♟");
      default:
        assertUnreachable(piece.type);
    }
  }

  toString() {
    const taken = (ix: number) => {
      if (ix === 0 && this.whiteTaken.length) {
        return `  taken: ${this.whiteTaken.join(" ")}`;
      }
      if (ix === 7 && this.blackTaken.length) {
        return `  taken: ${this.blackTaken.join(" ")}`;
      }
      return "";
    };

    return this.board
      .map(
        (rank, ix) => `${Printer.rankLabels[ix]}  ${rank.join(" ")}${taken(ix)}`
      )
      .reverse()
      .concat(`   ${Printer.fileLabels}`)
      .join("\n");
  }

  static fileLabels = indexes.map((i) => new Position(i, 0).fileName).join(" ");
  static rankLabels = indexes.map((i) => new Position(0, i).rankName);
}

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}
