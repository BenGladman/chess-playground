export type PositionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const CODEPOINT_a = "a".codePointAt(0)!;
const CODEPOINT_1 = "1".codePointAt(0)!;

function isPositionIndex(index: number | null): index is PositionIndex {
  return index !== null && index >= 0 && index <= 7;
}
export class Position {
  readonly fileIndex: PositionIndex;
  readonly rankIndex: PositionIndex;
  readonly isNull: boolean;

  private constructor(
    fileIndex: PositionIndex | null,
    rankIndex: PositionIndex | null
  ) {
    if (fileIndex === null || rankIndex === null) {
      this.fileIndex = 0;
      this.rankIndex = 0;
      this.isNull = true;
    } else {
      this.fileIndex = fileIndex;
      this.rankIndex = rankIndex;
      this.isNull = false;
    }
  }

  add(addFile: number, addRank: number) {
    if (this.isNull) {
      return this;
    }
    return Position.get(this.fileIndex + addFile, this.rankIndex + addRank);
  }

  atFile(fileIndex: number) {
    if (this.isNull) {
      return this;
    }
    return Position.get(fileIndex, this.rankIndex);
  }

  atRank(rankIndex: number) {
    if (this.isNull) {
      return this;
    }
    return Position.get(this.fileIndex, rankIndex);
  }

  equals(other: Position) {
    return (
      (this.isNull && other.isNull) ||
      (!this.isNull &&
        !other.isNull &&
        this.fileIndex === other.fileIndex &&
        this.rankIndex === other.rankIndex)
    );
  }

  toString() {
    if (this.isNull) {
      return "null";
    }
    return `${this.fileName}${this.rankName}`;
  }

  get fileName() {
    return this.isNull
      ? "null"
      : String.fromCodePoint(CODEPOINT_a + this.fileIndex);
  }

  get rankName() {
    return this.isNull
      ? "null"
      : String.fromCodePoint(CODEPOINT_1 + this.rankIndex);
  }

  static NULL = new Position(null, null);

  private static cache: Array<Position | undefined> = [];

  static get(fileIndex: number, rankIndex: number): Position {
    if (isPositionIndex(fileIndex) && isPositionIndex(rankIndex)) {
      const cacheKey = rankIndex * 8 + fileIndex;
      const cached = Position.cache[cacheKey];
      if (cached) {
        return cached;
      }
      const position = new Position(fileIndex, rankIndex);
      Position.cache[cacheKey] = position;
      return position;
    }
    return Position.NULL;
  }
}
