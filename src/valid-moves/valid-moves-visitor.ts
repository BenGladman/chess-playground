import {
  BoardComponent,
  Color,
  Move,
  PieceComponent,
  Position,
  SideComponent,
  Visitor,
} from "../core";

export abstract class ValidMovesVisitor implements Visitor {
  private _moves: Move[] = [];
  private pieces: readonly PieceComponent[] = [];
  protected isCheckAfterMove: (move: Move) => boolean;

  constructor(isCheckAfterMove: (move: Move) => boolean) {
    this.isCheckAfterMove = isCheckAfterMove;
  }

  visitBoard(board: BoardComponent) {
    this.pieces = [
      ...board.sideToPlay.pieces,
      ...board.otherSide.pieces,
    ].filter((piece) => !piece.position.isNull);
    board.sideToPlay.accept(this);
  }

  visitSide(side: SideComponent) {
    for (const piece of side.pieces) {
      if (!piece.position.isNull) {
        piece.accept(this);
      }
    }
  }

  visitKing(piece: PieceComponent) {}

  visitQueen(piece: PieceComponent) {}

  visitBishop(piece: PieceComponent) {}

  visitKnight(piece: PieceComponent) {}

  visitRook(piece: PieceComponent) {}

  visitPawn(piece: PieceComponent) {}

  protected pieceAtPosition(position: Position) {
    return this.pieces.find((piece) => piece.position === position);
  }

  protected createMove(piece: PieceComponent, newPosition: Position) {
    if (newPosition.isNull) {
      return null;
    }
    const capturePiece = this.pieceAtPosition(newPosition);
    if (capturePiece?.color === piece.color) {
      return null;
    }
    const move = new Move(piece, newPosition, capturePiece);
    return move;
  }

  protected possiblyAddMove(move: Move) {
    if (!this.isCheckAfterMove(move)) {
      this._moves.push(move);
    }
  }

  get moves(): readonly Move[] {
    return this._moves;
  }
}
