export type RankFileIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const CODEPOINT_1 = "1".codePointAt(0)!;
const CODEPOINT_a = "a".codePointAt(0)!;

export class Position {
  fileIndex: RankFileIndex;
  rankIndex: RankFileIndex;

  constructor(fileIndex: RankFileIndex, rankIndex: RankFileIndex) {
    this.fileIndex = fileIndex;
    this.rankIndex = rankIndex;
  }

  get fileName() {
    return String.fromCodePoint(CODEPOINT_a + this.fileIndex);
  }

  get rankName() {
    return String.fromCodePoint(CODEPOINT_1 + this.rankIndex);
  }

  get isBlack() {
    return (this.fileIndex + this.rankIndex) % 2 === 0;
  }
}
