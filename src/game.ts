import { Board } from "./board";
import { Color, Printer } from "./core";
import {
  CaptureStrategy,
  CheckStrategy,
  PlayStrategy,
  RandomStrategy,
} from "./play-strategies";

function createStrategy() {
  const strategies = [CaptureStrategy, CheckStrategy, RandomStrategy];
  const Strategy = strategies[Math.floor(Math.random() * strategies.length)];
  return new Strategy();
}

async function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Game {
  board = Board.create();
  whiteStrategy = createStrategy();
  blackStrategy = createStrategy();

  play(strategy: PlayStrategy) {
    this.board = strategy.play(this.board);
    console.log(
      `${strategy.name} move #${this.board.moves.length} ${this.board.lastMove} ${this.board}`
    );
  }

  print() {
    const printer = new Printer();
    this.board.accept(printer);
    console.log(printer.toString());
  }

  async run() {
    console.clear();
    console.log("Initial board");
    this.print();

    do {
      await pause(250);
      console.clear();
      this.play(
        this.board.sideToPlay.color === Color.White
          ? this.whiteStrategy
          : this.blackStrategy
      );
      this.print();
    } while (
      !this.board.isStaleMate &&
      !this.board.isCheckMate &&
      this.board.moves.length < 300
    );
  }
}

const game = new Game();
game.run();
