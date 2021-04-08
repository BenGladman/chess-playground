import { Board } from "./board";

class Game {
  board = new Board();

  play() {
    const possibleMoves = this.board.status.possibleMoves;
    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    this.board = this.board.play(randomMove);
  }

  run() {
    this.board.print();

    do {
      console.log("\n");
      this.play();
      console.log(
        `Random move #${this.board.moves.length} ${this.board.lastMove} ${this.board.status}`
      );
      this.board.print();
    } while (
      !this.board.status.isStaleMate &&
      !this.board.status.isCheckMate &&
      this.board.moves.length < 300
    );
  }
}

const game = new Game();
game.run();
