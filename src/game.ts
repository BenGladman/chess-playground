import { Board } from "./board";
import { Color, Printer } from "./core";
import {
  CaptureStrategy,
  CheckStrategy,
  RandomStrategy,
} from "./play-strategies";

function createStrategy() {
  const strategies = [CaptureStrategy, CheckStrategy, RandomStrategy] as const;
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

  print(head1 = "", head2 = "") {
    const HOME = "\x1b[1;1H";
    const ERASE_TO_END = "\x1b[K";
    const NL = "\n";

    const printer = new Printer();
    this.board.accept(printer);

    console.log(
      [
        HOME,
        head1,
        ERASE_TO_END,
        NL,
        head2,
        ERASE_TO_END,
        NL,
        NL,
        printer,
        NL,
      ].join("")
    );
  }

  async run() {
    this.print("Initial board");

    do {
      await pause(250);
      const strategy =
        this.board.sideToPlay.color === Color.White
          ? this.whiteStrategy
          : this.blackStrategy;
      this.board = strategy.play(this.board);
      this.print(
        `${strategy.name} move #${this.board.moves.length} ${this.board.lastMove}`,
        this.board.statusDescription
      );
    } while (
      !this.board.isStaleMate &&
      !this.board.isCheckMate &&
      this.board.moves.length < 300
    );
  }
}

process.on("SIGINT", () => {
  process.exit();
});

const game = new Game();
console.clear();
game.run();
