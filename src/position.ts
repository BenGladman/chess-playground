export type PositionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const CODEPOINT_a = "a".codePointAt(0)!;
const CODEPOINT_1 = "1".codePointAt(0)!;

function isPositionIndex(index: number | null): index is PositionIndex {
  return index !== null && index >= 0 && index <= 7;
}
export class Position {
  readonly fileIndex: PositionIndex;
  readonly rankIndex: PositionIndex;
  readonly null: boolean;

  constructor(fileIndex: number | null, rankIndex: number | null) {
    if (isPositionIndex(fileIndex) && isPositionIndex(rankIndex)) {
      this.fileIndex = fileIndex;
      this.rankIndex = rankIndex;
      this.null = false;
    } else {
      this.fileIndex = 0;
      this.rankIndex = 0;
      this.null = true;
    }
  }

  add(addFile: number, addRank: number) {
    if (this.null) {
      return this;
    }
    return new Position(this.fileIndex + addFile, this.rankIndex + addRank);
  }

  equals(other: Position) {
    return (
      (this.null && other.null) ||
      (!this.null &&
        !other.null &&
        this.fileIndex === other.fileIndex &&
        this.rankIndex === other.rankIndex)
    );
  }

  toString() {
    if (this.null) {
      return "null";
    }
    return `${this.fileName}${this.rankName}`;
  }

  get fileName() {
    return this.null
      ? "null"
      : String.fromCodePoint(CODEPOINT_a + this.fileIndex);
  }

  get rankName() {
    return this.null
      ? "null"
      : String.fromCodePoint(CODEPOINT_1 + this.rankIndex);
  }

  static NULL = new Position(null, null);
}
