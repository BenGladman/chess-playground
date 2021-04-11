import { Move, Visitable } from "../core";

export interface ValidMovesBoard extends Visitable {
  isCheckAfterMove(move: Move): boolean;
}
