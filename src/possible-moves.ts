import { Move } from "./move";
import { Position } from "./position";
import {
  BoardComponent,
  Color,
  PieceComponent,
  SideComponent,
  Visitor,
} from "./types";

export abstract class PossibleMoves implements Visitor {
  private _moves: Move[] = [];
  private pieces: readonly PieceComponent[] = [];
  protected isCheckAfterMove: (move: Move) => boolean;

  constructor(isCheckAfterMove: (move: Move) => boolean) {
    this.isCheckAfterMove = isCheckAfterMove;
  }

  visitBoard(board: BoardComponent) {
    this.pieces = [...board.black.pieces, ...board.white.pieces].filter(
      (piece) => !piece.position.isNull
    );
    const sideToPlay = board.turn === Color.White ? board.white : board.black;
    sideToPlay.accept(this);
  }

  visitSide(side: SideComponent) {
    for (const piece of side.pieces) {
      if (!piece.position.isNull) {
        piece.accept(this);
      }
    }
  }

  visitKing(piece: PieceComponent) {}

  visitQueen(piece: PieceComponent) {}

  visitBishop(piece: PieceComponent) {}

  visitKnight(piece: PieceComponent) {}

  visitRook(piece: PieceComponent) {}

  visitPawn(piece: PieceComponent) {}

  protected pieceAtPosition(position: Position) {
    return this.pieces.find((piece) => piece.position === position);
  }

  protected createMove(piece: PieceComponent, newPosition: Position) {
    if (newPosition.isNull) {
      return null;
    }
    const capturePiece = this.pieceAtPosition(newPosition);
    if (capturePiece?.color === piece.color) {
      return null;
    }
    const move = new Move(piece, newPosition, capturePiece);
    if (this.isCheckAfterMove(move)) {
      return null;
    }
    return move;
  }

  protected addMove(move: Move) {
    this._moves.push(move);
  }

  get moves(): readonly Move[] {
    return this._moves;
  }
}
