import { Position } from "./position";

export type Color = "W" | "B";

export enum PieceName {
  "King" = "King",
  "Queen" = "Queen",
  "Bishop" = "Bishop",
  "Knight" = "Knight",
  "Rook" = "Rook",
  "Pawn" = "Pawn",
}

export abstract class Piece {
  abstract readonly name: PieceName;
  abstract readonly shortName: string;

  readonly color: Color;
  readonly position: Position | null = null;

  constructor(color: Color, position: Position | null) {
    this.color = color;
    this.position = position;
  }

  accept(visitor: PieceVisitor) {
    visitor.visit(this);
  }
}

export class King extends Piece {
  name = PieceName.King;
  shortName = "K";
}

export class Queen extends Piece {
  name = PieceName.Queen;
  shortName = "Q";
}

export class Bishop extends Piece {
  name = PieceName.Bishop;
  shortName = "B";
}

export class Knight extends Piece {
  name = PieceName.Knight;
  shortName = "N";
}

export class Rook extends Piece {
  name = PieceName.Rook;
  shortName = "R";
}

export class Pawn extends Piece {
  name = PieceName.Pawn;
  shortName = "";
}

export interface PieceVisitor {
  visit(piece: Piece): void;
}
