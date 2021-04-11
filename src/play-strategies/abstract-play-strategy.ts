import { Move } from "../core";
import { StrategyBoard } from "./types";

export abstract class AbstractPlayStrategy {
  abstract name: string;

  protected abstract calculateScore(move: Move, board: StrategyBoard): number;

  play<Board extends StrategyBoard>(board: Board): Board {
    const scoredMoves = board.validMoves
      .map((move) => ({
        move,
        score: this.calculateScore(move, board),
      }))
      .sort((a, b) => b.score - a.score);

    return board.play(scoredMoves[0].move);
  }
}
