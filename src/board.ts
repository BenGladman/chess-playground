import {
  BoardComponent,
  Color,
  Move,
  PieceType,
  Playable,
  Visitor,
} from "./core";
import { StrategyBoard } from "./play-strategies";
import { Side } from "./side";
import { ValidMovesBoard, ValidMovesGenerator } from "./valid-moves";

export class Board
  implements BoardComponent, Playable, ValidMovesBoard, StrategyBoard {
  readonly sideToPlay: Side;
  readonly otherSide: Side;
  readonly moves: readonly Move[];
  readonly validMovesGenerator: ValidMovesGenerator;

  protected constructor(
    sideToPlay = Side.create(Color.White),
    otherSide = Side.create(Color.Black),
    moves: readonly Move[] = [],
    validMovesGenerator = new ValidMovesGenerator()
  ) {
    this.sideToPlay = sideToPlay;
    this.otherSide = otherSide;
    this.moves = moves;
    this.validMovesGenerator = validMovesGenerator;
  }

  get lastMove() {
    return this.moves.length > 0 ? this.moves[this.moves.length - 1] : null;
  }

  play(move: Move): this {
    return new Board(
      this.otherSide.play(move),
      this.sideToPlay.play(move),
      this.moves.concat(move),
      this.validMovesGenerator
    ) as this;
  }

  accept(visitor: Visitor) {
    visitor.visitBoard(this);
  }

  private _validMoves?: readonly Move[];

  get validMoves(): readonly Move[] {
    if (this._validMoves === undefined) {
      this._validMoves = this.validMovesGenerator.generate(this);
    }
    return this._validMoves;
  }

  private _isCheckOtherSide?: boolean;

  get isCheckOtherSide(): boolean {
    if (this._isCheckOtherSide === undefined) {
      this._isCheckOtherSide =
        this.validMoves.find(
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
    return !this.isCheck && this.validMoves.length === 0;
  }

  get isCheckMate(): boolean {
    return this.isCheck && this.validMoves.length === 0;
  }

  isCheckAfterMove(move: Move | null) {
    return new BoardRecursive(
      move ? this.otherSide.play(move) : this.otherSide,
      move ? this.sideToPlay.play(move) : this.sideToPlay,
      undefined,
      this.validMovesGenerator
    ).isCheckOtherSide;
  }

  get statusDescription(): string {
    const toPlayString = `${this.sideToPlay.color} to play`;
    const movesString = `${this.validMoves.length} valid moves`;
    return this.isCheckMate
      ? `CHECKMATE ${this.otherSide.color} wins`
      : this.isCheck
      ? `${toPlayString}, ${movesString} CHECK`
      : this.isStaleMate
      ? `${toPlayString} STALEMATE`
      : `${toPlayString}, ${movesString}`;
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
