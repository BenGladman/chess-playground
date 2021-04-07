import { PossibleMoves } from "./possible-moves";
import { PieceComponent, PieceType } from "./types";

export class PossibleMainMoves extends PossibleMoves {
  private possiblyAddMove(
    piece: PieceComponent,
    { start = piece.position, addFile = 0, addRank = 0, recurse = false } = {}
  ): void {
    const move = this.createMove(piece, start.add(addFile, addRank));
    if (!move) {
      return;
    }
    this.addMove(move);
    if (recurse && !move.capturePiece) {
      return this.possiblyAddMove(piece, {
        start: move.to,
        addFile,
        addRank,
        recurse,
      });
    }
  }

  visitPiece(piece: PieceComponent) {
    if (piece.position.null) {
      return;
    }

    switch (piece.type) {
      case PieceType.King:
        this.possiblyAddMove(piece, { addFile: -1, addRank: -1 });
        this.possiblyAddMove(piece, { addFile: 0, addRank: -1 });
        this.possiblyAddMove(piece, { addFile: 1, addRank: -1 });
        this.possiblyAddMove(piece, { addFile: -1, addRank: 0 });
        this.possiblyAddMove(piece, { addFile: 1, addRank: 0 });
        this.possiblyAddMove(piece, { addFile: -1, addRank: 1 });
        this.possiblyAddMove(piece, { addFile: 0, addRank: 1 });
        this.possiblyAddMove(piece, { addFile: 1, addRank: 1 });
        return;

      case PieceType.Queen:
        this.possiblyAddMove(piece, {
          addFile: -1,
          addRank: -1,
          recurse: true,
        });
        this.possiblyAddMove(piece, { addFile: 0, addRank: -1, recurse: true });
        this.possiblyAddMove(piece, { addFile: 1, addRank: -1, recurse: true });
        this.possiblyAddMove(piece, { addFile: -1, addRank: 0, recurse: true });
        this.possiblyAddMove(piece, { addFile: 1, addRank: 0, recurse: true });
        this.possiblyAddMove(piece, { addFile: -1, addRank: 1, recurse: true });
        this.possiblyAddMove(piece, { addFile: 0, addRank: 1, recurse: true });
        this.possiblyAddMove(piece, { addFile: 1, addRank: 1, recurse: true });
        return;

      case PieceType.Bishop:
        this.possiblyAddMove(piece, {
          addFile: -1,
          addRank: -1,
          recurse: true,
        });
        this.possiblyAddMove(piece, { addFile: 1, addRank: -1, recurse: true });
        this.possiblyAddMove(piece, { addFile: -1, addRank: 1, recurse: true });
        this.possiblyAddMove(piece, { addFile: 1, addRank: 1, recurse: true });
        return;

      case PieceType.Knight:
        this.possiblyAddMove(piece, { addFile: -2, addRank: -1 });
        this.possiblyAddMove(piece, { addFile: -1, addRank: -2 });
        this.possiblyAddMove(piece, { addFile: 1, addRank: -2 });
        this.possiblyAddMove(piece, { addFile: 2, addRank: -1 });
        this.possiblyAddMove(piece, { addFile: -2, addRank: 1 });
        this.possiblyAddMove(piece, { addFile: -1, addRank: 2 });
        this.possiblyAddMove(piece, { addFile: 1, addRank: 2 });
        this.possiblyAddMove(piece, { addFile: 2, addRank: 1 });
        return;

      case PieceType.Rook:
        this.possiblyAddMove(piece, { addFile: 0, addRank: -1, recurse: true });
        this.possiblyAddMove(piece, { addFile: -1, addRank: 0, recurse: true });
        this.possiblyAddMove(piece, { addFile: 1, addRank: 0, recurse: true });
        this.possiblyAddMove(piece, { addFile: 0, addRank: 1, recurse: true });
        return;
    }
  }
}
