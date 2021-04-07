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

  visitBoard(board: BoardComponent) {
    this.pieces = [...board.black.pieces, ...board.white.pieces].filter(
      (piece) => !piece.position.null
    );
    board.turn.accept(this);
  }

  visitSide(side: SideComponent) {
    for (const piece of side.pieces) {
      piece.accept(this);
    }
  }

  private tryNewPosition(start: Position, addFile: number, addRank: number) {
    const newPosition = start.add(addFile, addRank);
    const pieceInNewPosition = this.pieces.find((piece) =>
      piece.position.equal(newPosition)
    );

    return { newPosition, pieceInNewPosition };
  }

  private addMove(
    piece: PieceComponent,
    from: Position,
    to: Position,
    takePiece?: PieceComponent
  ) {
    this._moves.push(new Move(piece, from, to, takePiece));
  }

  private possiblyAddMove(
    piece: PieceComponent,
    start: Position,
    addFile: number,
    addRank: number,
    { recurse = false, mustTake = false, mustNotTake = false } = {}
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
        this.addMove(piece, piece.position, newPosition, pieceInNewPosition);
      }
      return false;
    }
    if (mustTake) {
      return false;
    }
    this.addMove(piece, piece.position, newPosition);
    if (recurse) {
      return this.possiblyAddMove(piece, newPosition, addFile, addRank, {
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
        this.possiblyAddMove(piece, piece.position, -1, -1);
        this.possiblyAddMove(piece, piece.position, 0, -1);
        this.possiblyAddMove(piece, piece.position, 1, -1);
        this.possiblyAddMove(piece, piece.position, -1, 0);
        this.possiblyAddMove(piece, piece.position, 1, 0);
        this.possiblyAddMove(piece, piece.position, -1, 1);
        this.possiblyAddMove(piece, piece.position, 0, 1);
        this.possiblyAddMove(piece, piece.position, 1, 1);
        return;
      case PieceType.Queen:
        this.possiblyAddMove(piece, piece.position, -1, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 0, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, -1, 0, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, 0, { recurse: true });
        this.possiblyAddMove(piece, piece.position, -1, 1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 0, 1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, 1, { recurse: true });
        return;
      case PieceType.Bishop:
        this.possiblyAddMove(piece, piece.position, -1, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, -1, 1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, 1, { recurse: true });
        return;
      case PieceType.Knight:
        this.possiblyAddMove(piece, piece.position, -2, -1);
        this.possiblyAddMove(piece, piece.position, -1, -2);
        this.possiblyAddMove(piece, piece.position, 1, -2);
        this.possiblyAddMove(piece, piece.position, 2, -1);
        this.possiblyAddMove(piece, piece.position, -2, 1);
        this.possiblyAddMove(piece, piece.position, -1, 2);
        this.possiblyAddMove(piece, piece.position, 1, 2);
        this.possiblyAddMove(piece, piece.position, 2, 1);
        return;
      case PieceType.Rook:
        this.possiblyAddMove(piece, piece.position, 0, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, -1, 0, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, 0, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 0, 1, { recurse: true });
        return;
      case PieceType.Pawn:
        const addRank = piece.color === Color.White ? 1 : -1;
        const initialRank = piece.color === Color.White ? 1 : 6;
        const canForward1 = this.possiblyAddMove(
          piece,
          piece.position,
          0,
          addRank,
          { mustNotTake: true }
        );
        if (canForward1 && piece.position.rankIndex === initialRank) {
          this.possiblyAddMove(piece, piece.position, 0, addRank * 2, {
            mustNotTake: true,
          });
        }
        this.possiblyAddMove(piece, piece.position, -1, addRank, {
          mustTake: true,
        });
        this.possiblyAddMove(piece, piece.position, 1, addRank, {
          mustTake: true,
        });
        return;
      default:
        assertUnreachable(piece.type);
    }
  }

  get moves(): readonly Move[] {
    return this._moves;
  }
}

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}
