import { PlayHandler, PlayStrategy } from "./types";

export class RandomStrategy implements PlayStrategy {
  name = "RandomStrategy";

  play: PlayHandler = (board) => {
    const validMoves = board.validMoves;
    const randomMove =
      validMoves[Math.floor(Math.random() * validMoves.length)];
    return board.play(randomMove);
  };
}
