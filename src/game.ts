import { Board } from "./board";
import { PossibleMoves } from "./possible-moves";
import { Printer } from "./printer";

const board = new Board();

const printer = new Printer();
board.accept(printer);
console.log(printer.toString());

const possibles = new PossibleMoves();
board.accept(possibles);
console.log(possibles.moves.map(String));
