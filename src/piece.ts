import {
  Color,
  Move,
  PieceComponent,
  PieceType,
  Playable,
  Position,
  PositionIndex,
  Visitor,
} from "./core";

export class Piece implements PieceComponent, Playable<Piece> {
  readonly color: Color;
  readonly type: PieceType;
  readonly position: Position;
  readonly hasMoved: boolean;

  private constructor(
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

  play(move: Move): Piece {
    if (move.piece === this) {
      return this.with(move.to, move.promote);
    } else if (move.capturePiece === this) {
      return this.with(Position.NULL);
    } else if (move.castle === this && move.castleTo) {
      return this.with(move.castleTo);
    } else {
      return this;
    }
  }

  accept(visitor: Visitor) {
    const visitMethod = `visit${this.type}` as const;
    visitor[visitMethod](this);
  }

  toString() {
    return `${this.color} ${this.type}`;
  }

  static create(
    color: Color,
    type: PieceType,
    fileIndex: PositionIndex,
    rankIndex: PositionIndex
  ) {
    return new Piece(color, type, Position.get(fileIndex, rankIndex));
  }
}
