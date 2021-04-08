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

interface Component {
  accept(visitor: Visitor): void;
}

export interface PieceComponent extends Component {
  readonly color: Color;
  readonly type: PieceType;
  readonly position: Position;
  readonly hasMoved: boolean;
}

export interface SideComponent extends Component {
  readonly color: Color;
  readonly pieces: readonly PieceComponent[];
}

export interface BoardComponent extends Component {
  readonly black: SideComponent;
  readonly white: SideComponent;
  readonly turn: Color;
  readonly lastMove: Move | null;
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
