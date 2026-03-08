export function colToLetter(col: number): string {
  let letter = '';
  while (col >= 0) {
    letter = String.fromCharCode(65 + (col % 26)) + letter;
    col = Math.floor(col / 26) - 1;
  }
  return letter;
}

export function letterToCol(letter: string): number {
  let col = 0;
  for (let i = 0; i < letter.length; i++) {
    col = col * 26 + (letter.charCodeAt(i) - 65 + 1);
  }
  return col - 1;
}

export function cellToAddress(row: number, col: number): string {
  return `${colToLetter(col)}${row + 1}`;
}

export function addressToCell(address: string): { row: number; col: number } | null {
  const match = address.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  return {
    col: letterToCol(match[1]),
    row: parseInt(match[2], 10) - 1,
  };
}

export function isValidCellAddress(address: string): boolean {
  return /^[A-Z]+\d+$/.test(address);
}

export function parseRange(range: string): string[] | null {
  const match = range.match(/^([A-Z]+\d+):([A-Z]+\d+)$/);
  if (!match) return null;

  const start = addressToCell(match[1]);
  const end = addressToCell(match[2]);
  if (!start || !end) return null;

  const cells: string[] = [];
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);

  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      cells.push(cellToAddress(row, col));
    }
  }

  return cells;
}
