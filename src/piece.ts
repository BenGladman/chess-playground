import { Position } from "./position";
import { Color, PieceComponent, PieceType, Visitor } from "./types";

export class Piece implements PieceComponent {
  readonly color: Color;
  readonly type: PieceType;
  readonly position: Position;
  readonly hasMoved: boolean;

  constructor(
    color: Color,
    type: PieceType,
    position: Position,
    hasMoved = false
  ) {
    this.color = color;
    this.type = type;
    this.position = position;
    this.hasMoved = hasMoved;
  }

  with(newPosition: Position, newType?: PieceType) {
    return new Piece(this.color, newType ?? this.type, newPosition, true);
  }

  accept(visitor: Visitor) {
    const visitMethod = `visit${this.type}` as const;
    visitor[visitMethod](this);
  }

  toString() {
    return `${this.color} ${this.type}`;
  }
}
