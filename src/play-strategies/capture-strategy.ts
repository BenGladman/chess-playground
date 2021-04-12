import { Move, PieceType } from "../core";
import { PlayHandler, PlayStrategy } from "./types";

const orderedTypes = [
  PieceType.King,
  PieceType.Queen,
  PieceType.Rook,
  PieceType.Knight,
  PieceType.Bishop,
  PieceType.Pawn,
  undefined,
];

function moveComparitor(a: Move, b: Move) {
  const result =
    orderedTypes.indexOf(a.capturePiece?.type) -
    orderedTypes.indexOf(b.capturePiece?.type);
  return result || Math.random() - 0.5;
}

export class CaptureStrategy implements PlayStrategy {
  name = "CaptureStrategy";

  play: PlayHandler = (board) => {
    const validMoves = [...board.validMoves].sort(moveComparitor);
    return board.play(validMoves[0]);
  };
}
