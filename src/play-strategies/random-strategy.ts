import { PlayHandler, PlayStrategy } from "./types";

export class RandomStrategy implements PlayStrategy {
  name = "RandomStrategy";

  play: PlayHandler = (board) => {
    const possibleMoves = board.possibleMoves;
    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    return board.play(randomMove);
  };
}
