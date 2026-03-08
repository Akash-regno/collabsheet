import { CellData } from '@/types';
import { tokenize } from './tokenizer';
import { Parser } from './parser';
import { Evaluator } from './evaluator';

export function evaluateFormula(
  formula: string,
  cells: Map<string, CellData>,
  currentCell?: string
): string {
  try {
    if (!formula.startsWith('=')) {
      return formula;
    }

    const expression = formula.substring(1);
    if (!expression.trim()) {
      return '';
    }

    const tokens = tokenize(expression);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const evaluator = new Evaluator(cells);
    const result = evaluator.evaluate(ast, currentCell);

    if (Array.isArray(result)) {
      return result.join(', ');
    }
    return typeof result === 'number' ? String(result) : result;
  } catch (error) {
    return '#ERROR!';
  }
}
