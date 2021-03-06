import {
  BoardComponent,
  Color,
  Move,
  PieceComponent,
  PieceType,
  Position,
  SideComponent,
} from "../core";
import { AbstractMovesGenerator } from "./abstract-moves-generator";

export class PawnMoves extends AbstractMovesGenerator {
  private lastMove: Move | null = null;
  private enPassantPiece?: PieceComponent;
  private enPassantPosition?: Position;

  visitBoard(board: BoardComponent) {
    this.lastMove = board.lastMove;
    super.visitBoard(board);
  }

  visitSide(side: SideComponent) {
    if (
      this.lastMove &&
      this.lastMove.piece.type === PieceType.Pawn &&
      !this.lastMove.piece.hasMoved
    ) {
      const advance1rank = side.color === Color.White ? 5 : 2;
      const advance2rank = side.color === Color.White ? 4 : 3;
      if (this.lastMove.to.rankIndex === advance2rank) {
        this.enPassantPosition = this.lastMove.to.atRank(advance1rank);
        this.enPassantPiece = this.pieceAtPosition(this.lastMove.to);
      }
    }

    super.visitSide(side);
  }

  visitPawn(piece: PieceComponent) {
    const addRank = piece.color === Color.White ? 1 : -1;

    const advance1 = this.createMove(piece, piece.position.add(0, addRank));
    if (advance1 && !advance1.capturePiece) {
      this.addMoveAndPromote(advance1);
      if (!piece.hasMoved) {
        const advance2 = this.createMove(
          piece,
          piece.position.add(0, addRank * 2)
        );
        if (advance2 && !advance2.capturePiece) {
          this.possiblyAddMove(advance2);
        }
      }
    }

    for (const addFile of [-1, 1]) {
      const newPosition = piece.position.add(addFile, addRank);
      const captureMove = this.createMove(piece, newPosition);
      if (captureMove && captureMove.capturePiece) {
        this.addMoveAndPromote(captureMove);
      } else if (this.enPassantPiece && this.enPassantPosition) {
        if (newPosition === this.enPassantPosition) {
          const enPassantMove = new Move(
            piece,
            newPosition,
            this.enPassantPiece
          );
          this.possiblyAddMove(enPassantMove);
        }
      }
    }
  }

  private addMoveAndPromote(move: Move) {
    const promoteRank = move.piece.color === Color.White ? 7 : 0;

    if (move.to.rankIndex === promoteRank) {
      for (const promoteTo of Move.PROMOTE_TO_TYPES) {
        const promoteMove = new Move(
          move.piece,
          move.to,
          move.capturePiece,
          promoteTo
        );
        this.possiblyAddMove(promoteMove);
      }
    } else {
      this.possiblyAddMove(move);
    }
  }
}
