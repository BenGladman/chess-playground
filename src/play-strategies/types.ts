import { Move, Playable } from "../core";

export interface StrategyBoard extends Playable {
  readonly lastMove: Move | null;
  readonly validMoves: readonly Move[];
  readonly isCheck: boolean;
}
