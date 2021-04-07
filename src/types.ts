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
}

export interface SideComponent extends Component {
  readonly color: Color;
  readonly pieces: readonly PieceComponent[];
}

export interface BoardComponent extends Component {
  readonly black: SideComponent;
  readonly white: SideComponent;
  readonly turn: Color;
}

export interface Visitor {
  visitPiece(piece: PieceComponent): void;
  visitSide(side: SideComponent): void;
  visitBoard(board: BoardComponent): void;
}
