import { AbstractPlayStrategy } from "./abstract-play-strategy";

export class RandomStrategy extends AbstractPlayStrategy {
  name = "RandomStrategy";

  protected calculateScore() {
    return Math.random();
  }
}
