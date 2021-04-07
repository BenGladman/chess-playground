import { Position } from "./position";
import { Color, PieceComponent, PieceType, Visitor } from "./types";

export class Piece implements PieceComponent {
  readonly color: Color;
  readonly type: PieceType;
  readonly position: Position;

  constructor(color: Color, type: PieceType, position: Position) {
    this.color = color;
    this.type = type;
    this.position = position;
  }

  with(newPosition: Position, newType?: PieceType) {
    return new Piece(this.color, newType ?? this.type, newPosition);
  }

  accept(visitor: Visitor) {
    visitor.visitPiece(this);
  }

  toString() {
    return `${this.color} ${this.type}`;
  }
}
