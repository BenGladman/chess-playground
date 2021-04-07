import { Move } from "./move";
import { PossibleMoves } from "./possible-moves";
import { Side } from "./side";
import { BoardComponent, Color, Visitor } from "./types";

export class Board implements BoardComponent {
  white: Side;
  black: Side;
  turn: Color;
  moves: readonly Move[];
  possibleMoves: readonly Move[];
  possibleKingCaptureMoves: readonly Move[];

  constructor(
    white = new Side(Color.White),
    black = new Side(Color.Black),
    turn = Color.White,
    moves = [] as readonly Move[]
  ) {
    this.white = white;
    this.black = black;
    this.turn = turn;
    this.moves = moves;

    const possibles = new PossibleMoves();
    this.accept(possibles);
    this.possibleMoves = possibles.moves;
    this.possibleKingCaptureMoves = possibles.kingCaptureMoves;
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

  private _isCheck?: boolean;

  get isCheck() {
    if (this._isCheck === undefined) {
      this._isCheck =
        new Board(this.white, this.black, this.nextTurn)
          .possibleKingCaptureMoves.length > 0;
    }
    return this._isCheck;
  }

  private _isCheckMate?: boolean;

  get isCheckMate() {
    if (this._isCheckMate === undefined) {
      this._isCheckMate =
        this.isCheck &&
        this.possibleMoves.every(
          (move) => this.play(move).possibleKingCaptureMoves.length > 0
        );
    }
    return this._isCheckMate;
  }

  accept(visitor: Visitor) {
    visitor.visitBoard(this);
  }
}
