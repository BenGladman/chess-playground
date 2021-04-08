import { Board } from "./board";
import { Move } from "./move";
import { PossibleCastleMoves } from "./possible-castle-moves";
import { PossibleMainMoves } from "./possible-main-moves";
import { PossiblePawnMoves } from "./possible-pawn-moves";
import { PieceType } from "./types";

export class BoardStatus {
  readonly board: Board;
  readonly possibleMoves: readonly Move[];
  readonly isCheckOtherSide: boolean;

  constructor(board: Board) {
    this.board = board;

    const possibleMoves: Move[] = [];

    for (const PossibleMoves of [
      PossibleMainMoves,
      PossiblePawnMoves,
      PossibleCastleMoves,
    ]) {
      const possibles = new PossibleMoves((move) =>
        this.isCheckAfterMove(move)
      );
      board.accept(possibles);
      possibleMoves.push(...possibles.moves);
    }

    this.possibleMoves = possibleMoves;
    this.isCheckOtherSide =
      possibleMoves.find(
        (move) => move.capturePiece?.type === PieceType.King
      ) !== undefined;
  }

  private _isCheck?: boolean;

  get isCheck() {
    if (this._isCheck === undefined) {
      this._isCheck = this.isCheckAfterMove(null);
    }
    return this._isCheck;
  }

  get isStaleMate() {
    return !this.isCheck && this.possibleMoves.length === 0;
  }

  get isCheckMate() {
    return this.isCheck && this.possibleMoves.length === 0;
  }

  protected isCheckAfterMove(move: Move | null) {
    const isCheck = new BoardStatusRecursive(this.board.play(move))
      .isCheckOtherSide;
    return isCheck;
  }

  toString() {
    const movesString = `${this.possibleMoves.length} possible moves`;
    return this.isCheckMate
      ? "CHECKMATE"
      : this.isCheck
      ? `CHECK (${movesString})`
      : this.isStaleMate
      ? "STALEMATE"
      : movesString;
  }
}

class BoardStatusRecursive extends BoardStatus {
  protected isCheckAfterMove(move: Move | null) {
    return false;
  }
}
