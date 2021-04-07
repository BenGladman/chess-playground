import { Move } from "./move";
import { Piece, PieceName } from "./piece";
import { Position } from "./position";

export class PossibleMoves implements PossibleMoves {
  private pieces: readonly Piece[];
  private _moves: Move[] = [];

  constructor(pieces: readonly Piece[]) {
    this.pieces = pieces;
  }

  private tryNewPosition(start: Position, addFile: number, addRank: number) {
    const newPosition = start.add(addFile, addRank);
    const pieceInNewPosition = this.pieces.find(
      (p) => !p.position.null && p.position.equal(newPosition)
    );

    return { newPosition, pieceInNewPosition };
  }

  private addMove(
    piece: Piece,
    from: Position,
    to: Position,
    takePiece?: Piece
  ) {
    this._moves.push(new Move(piece, from, to, takePiece));
  }

  private possiblyAddMove(
    piece: Piece,
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

  visit(piece: Piece) {
    if (!piece.position) {
      return;
    }

    switch (piece.name) {
      case PieceName.King:
        this.possiblyAddMove(piece, piece.position, -1, -1);
        this.possiblyAddMove(piece, piece.position, 0, -1);
        this.possiblyAddMove(piece, piece.position, 1, -1);
        this.possiblyAddMove(piece, piece.position, -1, 0);
        this.possiblyAddMove(piece, piece.position, 1, 0);
        this.possiblyAddMove(piece, piece.position, -1, 1);
        this.possiblyAddMove(piece, piece.position, 0, 1);
        this.possiblyAddMove(piece, piece.position, 1, 1);
        return;
      case PieceName.Queen:
        this.possiblyAddMove(piece, piece.position, -1, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 0, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, -1, 0, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, 0, { recurse: true });
        this.possiblyAddMove(piece, piece.position, -1, 1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 0, 1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, 1, { recurse: true });
        return;
      case PieceName.Bishop:
        this.possiblyAddMove(piece, piece.position, -1, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, -1, 1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, 1, { recurse: true });
        return;
      case PieceName.Knight:
        this.possiblyAddMove(piece, piece.position, -2, -1);
        this.possiblyAddMove(piece, piece.position, -1, -2);
        this.possiblyAddMove(piece, piece.position, 1, -2);
        this.possiblyAddMove(piece, piece.position, 2, -1);
        this.possiblyAddMove(piece, piece.position, -2, 1);
        this.possiblyAddMove(piece, piece.position, -1, 2);
        this.possiblyAddMove(piece, piece.position, 1, 2);
        this.possiblyAddMove(piece, piece.position, 2, 1);
        return;
      case PieceName.Rook:
        this.possiblyAddMove(piece, piece.position, 0, -1, { recurse: true });
        this.possiblyAddMove(piece, piece.position, -1, 0, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 1, 0, { recurse: true });
        this.possiblyAddMove(piece, piece.position, 0, 1, { recurse: true });
        return;
      case PieceName.Pawn:
        const addRank = piece.color === "W" ? 1 : -1;
        const canForward1 = this.possiblyAddMove(
          piece,
          piece.position,
          0,
          addRank,
          { mustNotTake: true }
        );
        if (canForward1 && !piece.hasMoved) {
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
        assertUnreachable(piece.name);
    }
  }

  get moves(): readonly Move[] {
    return this._moves;
  }
}

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}
