import { Move, Visitable } from "../core";
import { PossibleCastleMoves } from "./possible-castle-moves";
import { PossibleMainMoves } from "./possible-main-moves";
import { PossiblePawnMoves } from "./possible-pawn-moves";

interface PossibleMovesBoard extends Visitable {
  isCheckAfterMove(move: Move): boolean;
}

export class PossibleMovesGenerator {
  private readonly Visitors = [
    PossibleMainMoves,
    PossiblePawnMoves,
    PossibleCastleMoves,
  ];

  generate(board: PossibleMovesBoard): readonly Move[] {
    const possibleMoves: Move[] = [];

    for (const Visitor of this.Visitors) {
      const visitor = new Visitor((move) => board.isCheckAfterMove(move));
      board.accept(visitor);
      possibleMoves.push(...visitor.moves);
    }

    return possibleMoves;
  }
}
