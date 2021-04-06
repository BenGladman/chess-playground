import { Piece, PieceVisitor, Color, PieceName } from "./piece";

export class PieceSymbol implements PieceVisitor {
  private symbol = "";

  visit(piece: Piece) {
    const set = (white: string, black: string) => {
      this.symbol = piece.color === "W" ? white : black;
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
    return this.symbol ? `${this.symbol} ` : "  ";
  }
}

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}
