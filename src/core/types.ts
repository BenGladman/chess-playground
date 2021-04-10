import type { Move } from "./move";
import type { Position } from "./position";

export enum Color {
  "White" = "White",
  "Black" = "Black",
}

export enum PieceType {
  "King" = "King",
  "Queen" = "Queen",
  "Bishop" = "Bishop",
  "Knight" = "Knight",
  "Rook" = "Rook",
  "Pawn" = "Pawn",
}

export interface Visitable {
  accept(visitor: Visitor): void;
}

export interface PieceComponent extends Visitable {
  readonly color: Color;
  readonly type: PieceType;
  readonly position: Position;
  readonly hasMoved: boolean;
}

export interface SideComponent extends Visitable {
  readonly color: Color;
  readonly pieces: readonly PieceComponent[];
}

export interface BoardComponent extends Visitable {
  readonly black: SideComponent;
  readonly white: SideComponent;
  readonly turn: Color;
  readonly lastMove: Move | null;
}

export interface Playable<T> {
  play(this: T, move: Move | null): T;
}

export interface Visitor {
  visitKing(piece: PieceComponent): void;
  visitQueen(piece: PieceComponent): void;
  visitBishop(piece: PieceComponent): void;
  visitKnight(piece: PieceComponent): void;
  visitRook(piece: PieceComponent): void;
  visitPawn(piece: PieceComponent): void;
  visitSide(side: SideComponent): void;
  visitBoard(board: BoardComponent): void;
}
