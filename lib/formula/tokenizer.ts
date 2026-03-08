import { FormulaToken } from '@/types';

export function tokenize(formula: string): FormulaToken[] {
  const tokens: FormulaToken[] = [];
  let i = 0;

  while (i < formula.length) {
    const char = formula[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (char === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    if (['+', '-', '*', '/', '%', '^'].includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }

    if (/\d/.test(char)) {
      let num = '';
      while (i < formula.length && /[\d.]/.test(formula[i])) {
        num += formula[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    if (char === '"') {
      let str = '';
      i++;
      while (i < formula.length && formula[i] !== '"') {
        str += formula[i];
        i++;
      }
      i++;
      tokens.push({ type: 'STRING', value: str });
      continue;
    }

    if (/[A-Z]/.test(char)) {
      let ref = '';
      while (i < formula.length && /[A-Z0-9:]/.test(formula[i])) {
        ref += formula[i];
        i++;
      }

      if (ref.includes(':')) {
        tokens.push({ type: 'RANGE', value: ref });
      } else if (/^[A-Z]+\d+$/.test(ref)) {
        tokens.push({ type: 'CELL_REF', value: ref });
      } else if (/^[A-Z]+$/.test(ref)) {
        tokens.push({ type: 'FUNCTION', value: ref });
      } else {
        throw new Error(`Invalid reference: ${ref}`);
      }
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
}
