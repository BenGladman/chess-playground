import { Board } from "./board";
import { Move } from "./move";
import { PossibleMoves } from "./possible-moves";

export class BoardStatus {
  readonly board: Board;
  readonly possibleMoves: readonly Move[];
  readonly possibleKingCaptureMoves: readonly Move[];

  constructor(board: Board, disableIsCheckAfterMove = false) {
    this.board = board;
    if (disableIsCheckAfterMove) {
      this.isCheckAfterMove = () => false;
    }
    const possibles = new PossibleMoves((move) => this.isCheckAfterMove(move));
    board.accept(possibles);
    this.possibleMoves = possibles.moves;
    this.possibleKingCaptureMoves = possibles.kingCaptureMoves;
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

  private _isCheckMate?: boolean;

  get isCheckMate() {
    if (this._isCheckMate === undefined) {
      this._isCheckMate =
        this.isCheck &&
        this.possibleMoves.every((move) => this.isCheckAfterMove(move));
    }
    return this._isCheckMate;
  }

  private isCheckAfterMove(move: Move | null) {
    const isCheck =
      new BoardStatus(this.board.play(move), true).possibleKingCaptureMoves
        .length > 0;
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
