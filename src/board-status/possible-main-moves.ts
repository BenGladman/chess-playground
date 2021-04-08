import { PieceComponent } from "../core";
import { PossibleMoves } from "./possible-moves";

export class PossibleMainMoves extends PossibleMoves {
  private tryMove(
    piece: PieceComponent,
    { start = piece.position, addFile = 0, addRank = 0, recurse = false } = {}
  ): void {
    const move = this.createMove(piece, start.add(addFile, addRank));
    if (!move) {
      return;
    }
    this.possiblyAddMove(move);
    if (recurse && !move.capturePiece) {
      return this.tryMove(piece, {
        start: move.to,
        addFile,
        addRank,
        recurse,
      });
    }
  }

  visitKing(piece: PieceComponent) {
    this.tryMove(piece, { addFile: -1, addRank: -1 });
    this.tryMove(piece, { addFile: 0, addRank: -1 });
    this.tryMove(piece, { addFile: 1, addRank: -1 });
    this.tryMove(piece, { addFile: -1, addRank: 0 });
    this.tryMove(piece, { addFile: 1, addRank: 0 });
    this.tryMove(piece, { addFile: -1, addRank: 1 });
    this.tryMove(piece, { addFile: 0, addRank: 1 });
    this.tryMove(piece, { addFile: 1, addRank: 1 });
  }

  visitQueen(piece: PieceComponent) {
    this.tryMove(piece, { addFile: -1, addRank: -1, recurse: true });
    this.tryMove(piece, { addFile: 0, addRank: -1, recurse: true });
    this.tryMove(piece, { addFile: 1, addRank: -1, recurse: true });
    this.tryMove(piece, { addFile: -1, addRank: 0, recurse: true });
    this.tryMove(piece, { addFile: 1, addRank: 0, recurse: true });
    this.tryMove(piece, { addFile: -1, addRank: 1, recurse: true });
    this.tryMove(piece, { addFile: 0, addRank: 1, recurse: true });
    this.tryMove(piece, { addFile: 1, addRank: 1, recurse: true });
  }

  visitBishop(piece: PieceComponent) {
    this.tryMove(piece, { addFile: -1, addRank: -1, recurse: true });
    this.tryMove(piece, { addFile: 1, addRank: -1, recurse: true });
    this.tryMove(piece, { addFile: -1, addRank: 1, recurse: true });
    this.tryMove(piece, { addFile: 1, addRank: 1, recurse: true });
  }

  visitKnight(piece: PieceComponent) {
    this.tryMove(piece, { addFile: -2, addRank: -1 });
    this.tryMove(piece, { addFile: -1, addRank: -2 });
    this.tryMove(piece, { addFile: 1, addRank: -2 });
    this.tryMove(piece, { addFile: 2, addRank: -1 });
    this.tryMove(piece, { addFile: -2, addRank: 1 });
    this.tryMove(piece, { addFile: -1, addRank: 2 });
    this.tryMove(piece, { addFile: 1, addRank: 2 });
    this.tryMove(piece, { addFile: 2, addRank: 1 });
  }

  visitRook(piece: PieceComponent) {
    this.tryMove(piece, { addFile: 0, addRank: -1, recurse: true });
    this.tryMove(piece, { addFile: -1, addRank: 0, recurse: true });
    this.tryMove(piece, { addFile: 1, addRank: 0, recurse: true });
    this.tryMove(piece, { addFile: 0, addRank: 1, recurse: true });
  }
}
