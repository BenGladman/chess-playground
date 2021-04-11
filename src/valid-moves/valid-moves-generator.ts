import { Move, Visitable } from "../core";
import { Castling } from "./castling";
import { MainMoves } from "./main-moves";
import { PawnMoves } from "./pawn-moves";
import { ValidMovesBoard, MovesGenerator } from "./types";

export class ValidMovesGenerator implements MovesGenerator {
  private readonly generators: readonly MovesGenerator[];

  constructor(board: ValidMovesBoard) {
    this.generators = [
      new MainMoves(board),
      new PawnMoves(board),
      new Castling(board),
    ];
  }

  generate(): readonly Move[] {
    return this.generators.flatMap((generator) => generator.generate());
  }
}
