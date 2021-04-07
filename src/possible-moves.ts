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

export abstract class PossibleMoves implements Visitor {
  private _moves: Move[] = [];
  private _kingCaptureMoves: Move[] = [];
  protected pieces: readonly PieceComponent[] = [];
  protected isCheckAfterMove: (move: Move) => boolean;

  constructor(isCheckAfterMove: (move: Move) => boolean) {
    this.isCheckAfterMove = isCheckAfterMove;
  }

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

  visitPiece(piece: PieceComponent) {}

  protected createMove(piece: PieceComponent, newPosition: Position) {
    if (newPosition.null) {
      return null;
    }
    const capturePiece = this.pieces.find((piece) =>
      piece.position.equals(newPosition)
    );
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
    if (move.capturePiece?.type === PieceType.King) {
      this._kingCaptureMoves.push(move);
    }
  }

  get moves(): readonly Move[] {
    return this._moves;
  }

  get kingCaptureMoves(): readonly Move[] {
    return this._kingCaptureMoves;
  }
}
