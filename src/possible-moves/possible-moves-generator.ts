import { BoardComponent, Move } from "../core";
import { PossibleCastleMoves } from "./possible-castle-moves";
import { PossibleMainMoves } from "./possible-main-moves";
import { PossiblePawnMoves } from "./possible-pawn-moves";

interface PossibleMovesBoard extends BoardComponent {
  isCheckAfterMove(move: Move): boolean;
}

export class PossibleMovesGenerator {
  private readonly Visitors = [
    PossibleMainMoves,
    PossiblePawnMoves,
    PossibleCastleMoves,
  ];

  private board: PossibleMovesBoard;

  constructor(board: PossibleMovesBoard) {
    this.board = board;
  }

  generate(): readonly Move[] {
    const possibleMoves: Move[] = [];

    for (const Visitor of this.Visitors) {
      const visitor = new Visitor((move) => this.board.isCheckAfterMove(move));
      this.board.accept(visitor);
      possibleMoves.push(...visitor.moves);
    }

    return possibleMoves;
  }
}
