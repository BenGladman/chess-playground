import { Move } from "./move";
import { Position } from "./position";
import {
  BoardComponent,
  Color,
  PieceComponent,
  PieceType,
  SideComponent,
  Visitor,
} from "./types";

export class PossibleMoves implements Visitor {
  private pieces: readonly PieceComponent[] = [];
  private _moves: Move[] = [];
  private _kingCaptureMoves: Move[] = [];

  visitBoard(board: BoardComponent) {
    this.pieces = [...board.black.pieces, ...board.white.pieces].filter(
      (piece) => !piece.position.null
    );
    const sideToPlay = board.turn === Color.White ? board.white : board.black;
    sideToPlay.accept(this);
  }

  visitSide(side: SideComponent) {
    for (const piece of side.pieces) {
      piece.accept(this);
    }
  }

  private createMove(piece: PieceComponent, newPosition: Position) {
    if (newPosition.null) {
      return null;
    }
    const pieceInNewPosition = this.pieces.find((piece) =>
      piece.position.equals(newPosition)
    );
    if (pieceInNewPosition?.color === piece.color) {
      return null;
    }
    return new Move(piece, newPosition, pieceInNewPosition);
  }

  private addMove(move: Move) {
    this._moves.push(move);
    if (move.capturePiece?.type === PieceType.King) {
      this._kingCaptureMoves.push(move);
    }
  }

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

      case PieceType.Pawn:
        const addRank = piece.color === Color.White ? 1 : -1;
        const initialRank = piece.color === Color.White ? 1 : 6;
        const promoteRank = piece.color === Color.White ? 7 : 0;

        const addMoveAndPromote = (move: Move) => {
          if (move.to.rankIndex === promoteRank) {
            for (const promote of Move.PROMOTE_TYPES) {
              this.addMove(
                new Move(move.piece, move.to, move.capturePiece, promote)
              );
            }
          } else {
            this.addMove(move);
          }
        };

        const advance1 = this.createMove(piece, piece.position.add(0, addRank));
        if (advance1 && !advance1.capturePiece) {
          addMoveAndPromote(advance1);
          if (piece.position.rankIndex === initialRank) {
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
          const captureMove = this.createMove(
            piece,
            piece.position.add(addFile, addRank)
          );
          if (captureMove && captureMove.capturePiece) {
            addMoveAndPromote(captureMove);
          }
        }
        return;

      default:
        assertUnreachable(piece.type);
    }
  }

  get moves(): readonly Move[] {
    return this._moves;
  }

  get kingCaptureMoves(): readonly Move[] {
    return this._kingCaptureMoves;
  }
}

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}
