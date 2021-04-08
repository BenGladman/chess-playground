import { Move } from "./move";
import { Position } from "./position";
import { PossibleMoves } from "./possible-moves";
import {
  BoardComponent,
  Color,
  PieceComponent,
  PieceType,
  SideComponent,
} from "./types";

export class PossiblePawnMoves extends PossibleMoves {
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
          this.addMove(advance2);
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
          if (!this.isCheckAfterMove(enPassantMove)) {
            this.addMove(enPassantMove);
          }
        }
      }
    }
  }

  private addMoveAndPromote(move: Move) {
    const promoteRank = move.piece.color === Color.White ? 7 : 0;

    if (move.to.rankIndex === promoteRank) {
      for (const promote of Move.PROMOTE_TYPES) {
        const promoteMove = new Move(
          move.piece,
          move.to,
          move.capturePiece,
          promote
        );
        this.addMove(promoteMove);
      }
    } else {
      this.addMove(move);
    }
  }
}
