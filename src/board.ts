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
  sideToPlay: Side;
  otherSide: Side;
  moves: readonly Move[];
  possibleMovesGenerator: PossibleMovesGenerator;

  protected constructor(
    sideToPlay = Side.create(Color.White),
    otherSide = Side.create(Color.Black),
    moves: readonly Move[] = [],
    possibleMovesGenerator = new PossibleMovesGenerator()
  ) {
    this.sideToPlay = sideToPlay;
    this.otherSide = otherSide;
    this.moves = moves;
    this.possibleMovesGenerator = possibleMovesGenerator;
  }

  get lastMove() {
    return this.moves.length > 0 ? this.moves[this.moves.length - 1] : null;
  }

  play(move: Move) {
    return new Board(
      this.otherSide.play(move),
      this.sideToPlay.play(move),
      this.moves.concat(move),
      this.possibleMovesGenerator
    );
  }

  accept(visitor: Visitor) {
    visitor.visitBoard(this);
  }

  private _possibleMoves?: readonly Move[];

  get possibleMoves(): readonly Move[] {
    if (this._possibleMoves === undefined) {
      this._possibleMoves = this.possibleMovesGenerator.generate(this);
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
      move ? this.otherSide.play(move) : this.otherSide,
      move ? this.sideToPlay.play(move) : this.sideToPlay,
      undefined,
      this.possibleMovesGenerator
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
