import { Move } from "../core";
import { Castling } from "./castling";
import { MainMoves } from "./main-moves";
import { PawnMoves } from "./pawn-moves";
import { ValidMovesBoard } from "./types";
import { AbstractMovesGenerator } from "./abstract-moves-generator";

export class ValidMovesGenerator {
  private readonly generators: readonly AbstractMovesGenerator[];

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
