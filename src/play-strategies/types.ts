import { Move, Playable } from "../core";

export interface StrategyBoard {
  readonly validMoves: readonly Move[];
  readonly isCheck: boolean;
}

export type PlayHandler = <Board extends StrategyBoard & Playable<Board>>(
  board: Board
) => Board;

export interface PlayStrategy {
  name: string;
  play: PlayHandler;
}
