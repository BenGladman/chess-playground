import {
  BoardComponent,
  Color,
  Move,
  PieceType,
  Playable,
  Visitor,
} from "./core";
import { PossibleMovesGenerator } from "./possible-moves";
import { Side } from "./side";

export class Board implements BoardComponent, Playable<Board> {
  white: Side;
  black: Side;
  turn: Color;
  moves: readonly Move[];

  protected constructor(
    white = Side.create(Color.White),
    black = Side.create(Color.Black),
    turn = Color.White,
    moves: readonly Move[] = []
  ) {
    this.white = white;
    this.black = black;
    this.turn = turn;
    this.moves = moves;
  }

  get lastMove() {
    return this.moves.length > 0 ? this.moves[this.moves.length - 1] : null;
  }

  get nextTurn() {
    return this.turn === Color.White ? Color.Black : Color.White;
  }

  play(move: Move) {
    return new Board(
      this.white.play(move),
      this.black.play(move),
      this.nextTurn,
      this.moves.concat(move)
    );
  }

  accept(visitor: Visitor) {
    visitor.visitBoard(this);
  }

  private _possibleMoves?: readonly Move[];

  get possibleMoves(): readonly Move[] {
    if (this._possibleMoves === undefined) {
      this._possibleMoves = new PossibleMovesGenerator(this).generate();
    }
    return this._possibleMoves;
  }

  private _isCheckOtherSide?: boolean;

  get isCheckOtherSide(): boolean {
    if (this._isCheckOtherSide === undefined) {
      this._isCheckOtherSide =
        this.possibleMoves.find(
          (move) => move.capturePiece?.type === PieceType.King
        ) !== undefined;
    }
    return this._isCheckOtherSide;
  }

  private _isCheck?: boolean;

  get isCheck(): boolean {
    if (this._isCheck === undefined) {
      this._isCheck = this.isCheckAfterMove(null);
    }
    return this._isCheck;
  }

  get isStaleMate(): boolean {
    return !this.isCheck && this.possibleMoves.length === 0;
  }

  get isCheckMate(): boolean {
    return this.isCheck && this.possibleMoves.length === 0;
  }

  isCheckAfterMove(move: Move | null) {
    return new BoardRecursive(
      move ? this.white.play(move) : this.white,
      move ? this.black.play(move) : this.black,
      this.nextTurn
    ).isCheckOtherSide;
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

  static create() {
    return new Board();
  }
}

class BoardRecursive extends Board {
  isCheckAfterMove() {
    return false;
  }
}
