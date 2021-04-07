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

  private tryNewPosition(start: Position, addFile: number, addRank: number) {
    const newPosition = start.add(addFile, addRank);
    const pieceInNewPosition = this.pieces.find((piece) =>
      piece.position.equals(newPosition)
    );

    return { newPosition, pieceInNewPosition };
  }

  private addMove(
    piece: PieceComponent,
    to: Position,
    takePiece?: PieceComponent
  ) {
    const move = new Move(piece, to, takePiece);
    if (takePiece?.type === PieceType.King) {
      this._kingCaptureMoves.push(move);
    }
    this._moves.push(move);
  }

  private possiblyAddMove(
    piece: PieceComponent,
    {
      start = piece.position,
      addFile = 0,
      addRank = 0,
      recurse = false,
      mustTake = false,
      mustNotTake = false,
    } = {}
  ): boolean {
    const { newPosition, pieceInNewPosition } = this.tryNewPosition(
      start,
      addFile,
      addRank
    );
    if (newPosition.null) {
      return false;
    }
    if (pieceInNewPosition) {
      if (!mustNotTake && pieceInNewPosition.color !== piece.color) {
        this.addMove(piece, newPosition, pieceInNewPosition);
      }
      return false;
    }
    if (mustTake) {
      return false;
    }
    this.addMove(piece, newPosition);
    if (recurse) {
      return this.possiblyAddMove(piece, {
        start: newPosition,
        addFile,
        addRank,
        recurse,
        mustTake,
        mustNotTake,
      });
    }
    return true;
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
        const canForward1 = this.possiblyAddMove(piece, {
          addFile: 0,
          addRank,
          mustNotTake: true,
        });
        if (canForward1 && piece.position.rankIndex === initialRank) {
          this.possiblyAddMove(piece, {
            addFile: 0,
            addRank: addRank * 2,
            mustNotTake: true,
          });
        }
        this.possiblyAddMove(piece, { addFile: -1, addRank, mustTake: true });
        this.possiblyAddMove(piece, { addFile: 1, addRank, mustTake: true });
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
