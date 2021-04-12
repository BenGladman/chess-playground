import { Move, Visitable } from "../core";
import { Castling } from "./castling";
import { MainMoves } from "./main-moves";
import { PawnMoves } from "./pawn-moves";

export interface ValidMovesBoard extends Visitable {
  isCheckAfterMove(move: Move): boolean;
}

export class ValidMovesGenerator {
  private readonly Visitors = [MainMoves, PawnMoves, Castling];

  generate(board: ValidMovesBoard): readonly Move[] {
    const validMoves: Move[] = [];

    for (const Visitor of this.Visitors) {
      const visitor = new Visitor((move) => board.isCheckAfterMove(move));
      board.accept(visitor);
      validMoves.push(...visitor.moves);
    }

    return validMoves;
  }
}
