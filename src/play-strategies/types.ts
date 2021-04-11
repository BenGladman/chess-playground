import { Move, Playable } from "../core";

export interface StrategyBoard extends Playable {
  readonly validMoves: readonly Move[];
  readonly isCheck: boolean;
}

export type PlayHandler = <Board extends StrategyBoard>(
  board: Board
) => Board;

export interface PlayStrategy {
  name: string;
  play: PlayHandler;
}
