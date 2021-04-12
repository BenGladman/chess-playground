import { PlayHandler, PlayStrategy, StrategyBoard } from "./types";

function boardComparitor(a: StrategyBoard, b: StrategyBoard) {
  const result = (a.isCheck ? 1 : 2) - (b.isCheck ? 1 : 2);
  return result || Math.random() - 0.5;
}

export class CheckStrategy implements PlayStrategy {
  name = "CheckStrategy";

  play: PlayHandler = (board) => {
    const nextBoards = board.validMoves
      .map((move) => board.play(move))
      .sort(boardComparitor);

    return nextBoards[Math.floor(Math.random() * nextBoards.length)];
  };
}
