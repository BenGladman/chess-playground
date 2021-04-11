import { Move, PieceType } from "../core";
import { AbstractPlayStrategy } from "./abstract-play-strategy";
import { StrategyBoard } from "./types";

const orderedTypes = [
  undefined,
  PieceType.Pawn,
  PieceType.Bishop,
  PieceType.Knight,
  PieceType.Rook,
  PieceType.Queen,
  PieceType.King,
];

export class CaptureStrategy extends AbstractPlayStrategy {
  name = "CaptureStrategy";

  protected calculateScore(move: Move) {
    return orderedTypes.indexOf(move.capturePiece?.type) + Math.random();
  }
}
