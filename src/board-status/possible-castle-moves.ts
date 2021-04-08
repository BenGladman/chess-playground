import { Move, PieceComponent, PieceType, SideComponent } from "../core";
import { PossibleMoves } from "./possible-moves";

export class PossibleCastleMoves extends PossibleMoves {
  visitSide(side: SideComponent) {
    const king = side.pieces.find(
      (piece) =>
        !piece.position.isNull &&
        piece.type === PieceType.King &&
        !piece.hasMoved
    );
    const rooks = side.pieces.filter(
      (piece) =>
        !piece.position.isNull &&
        piece.type === PieceType.Rook &&
        !piece.hasMoved
    );
    if (!king || rooks.length === 0) {
      return;
    }

    for (const rook of rooks) {
      this.possiblyAddCastle(king, rook);
    }
  }

  private possiblyAddCastle(king: PieceComponent, rook: PieceComponent) {
    const emptyFrom =
      rook.position.fileIndex === 0 ? 0 : king.position.fileIndex + 1;
    const emptyTo =
      rook.position.fileIndex === 0 ? king.position.fileIndex - 1 : 6;

    for (let fileIndex = emptyFrom; fileIndex <= emptyTo; fileIndex++) {
      if (this.pieceAtPosition(king.position.atFile(fileIndex))) {
        return;
      }
    }

    const newKingPosition = king.position.atFile(
      rook.position.fileIndex === 0
        ? king.position.fileIndex - 2
        : king.position.fileIndex + 2
    );

    const newRookPosition = king.position.atFile(
      rook.position.fileIndex === 0
        ? king.position.fileIndex - 1
        : king.position.fileIndex + 1
    );

    const throughMove = new Move(king, newRookPosition);
    if (this.isCheckAfterMove(throughMove)) {
      return;
    }

    const castleMove = new Move(
      king,
      newKingPosition,
      undefined,
      undefined,
      rook,
      newRookPosition
    );
    if (this.isCheckAfterMove(castleMove)) {
      return;
    }

    this.addMove(castleMove);
  }
}
