import { Board } from "./board";
import { Move } from "./move";
import { PossibleCastleMoves } from "./possible-castle-moves";
import { PossibleMainMoves } from "./possible-main-moves";
import { PossiblePawnMoves } from "./possible-pawn-moves";

export class BoardStatus {
  readonly board: Board;
  readonly possibleMoves: readonly Move[];
  readonly possibleKingCaptureMoves: readonly Move[];

  constructor(board: Board, disableIsCheckAfterMove = false) {
    this.board = board;
    if (disableIsCheckAfterMove) {
      this.isCheckAfterMove = () => false;
    }

    const isCheckAfterMove = this.isCheckAfterMove.bind(this);

    const possibles = new PossibleMainMoves(isCheckAfterMove);
    board.accept(possibles);

    const pawnPossibles = new PossiblePawnMoves(isCheckAfterMove);
    board.accept(pawnPossibles);

    const castlePossibles = new PossibleCastleMoves(isCheckAfterMove);
    board.accept(castlePossibles);

    this.possibleMoves = [
      ...possibles.moves,
      ...pawnPossibles.moves,
      ...castlePossibles.moves,
    ];
    this.possibleKingCaptureMoves = [
      ...possibles.kingCaptureMoves,
      ...pawnPossibles.kingCaptureMoves,
    ];
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
