import { Move } from "../core";
import { AbstractPlayStrategy } from "./abstract-play-strategy";
import { StrategyBoard } from "./types";

export class CheckStrategy extends AbstractPlayStrategy {
  name = "CheckStrategy";

  protected calculateScore(move: Move, board: StrategyBoard) {
    const nextBoard = board.play(move);
    return (nextBoard.isCheck ? 2 : 1) + Math.random();
  }
}
