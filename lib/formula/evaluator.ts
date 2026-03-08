import { FormulaNode, CellData } from '@/types';
import { parseRange } from '../utils/cellAddress';

export class Evaluator {
  private cells: Map<string, CellData>;
  private evaluating: Set<string>;

  constructor(cells: Map<string, CellData>) {
    this.cells = cells;
    this.evaluating = new Set();
  }

  evaluate(node: FormulaNode, currentCell?: string): string | number | number[] {
    if (currentCell && this.evaluating.has(currentCell)) {
      return '#CIRCULAR!';
    }

    if (currentCell) {
      this.evaluating.add(currentCell);
    }

    try {
      const result = this.evaluateNode(node);
      if (currentCell) {
        this.evaluating.delete(currentCell);
      }
      return result;
    } catch (error) {
      if (currentCell) {
        this.evaluating.delete(currentCell);
      }
      return '#ERROR!';
    }
  }

  private evaluateNode(node: FormulaNode): string | number | number[] {
    switch (node.type) {
      case 'NUMBER':
        return node.value as number;

      case 'STRING':
        return node.value as string;

      case 'CELL_REF': {
        const cellAddress = node.value as string;
        const cell = this.cells.get(cellAddress);
        if (!cell) return 0;

        if (cell.formula && this.evaluating.has(cellAddress)) {
          return '#CIRCULAR!';
        }

        if (cell.value === '') return 0;
        const num = parseFloat(cell.value);
        return isNaN(num) ? cell.value : num;
      }

      case 'RANGE': {
        const addresses = parseRange(node.value as string);
        if (!addresses) return '#ERROR!';
        return addresses.map(addr => {
          const cell = this.cells.get(addr);
          if (!cell || cell.value === '') return 0;
          const num = parseFloat(cell.value);
          return isNaN(num) ? 0 : num;
        });
      }

      case 'BINARY_OP': {
        const left = this.evaluateNode(node.left!);
        const right = this.evaluateNode(node.right!);

        if (typeof left === 'string' && left.startsWith('#')) return left;
        if (typeof right === 'string' && right.startsWith('#')) return right;

        const l = typeof left === 'number' ? left : parseFloat(left as string);
        const r = typeof right === 'number' ? right : parseFloat(right as string);

        if (isNaN(l) || isNaN(r)) return '#ERROR!';

        switch (node.operator) {
          case '+': return l + r;
          case '-': return l - r;
          case '*': return l * r;
          case '/': return r === 0 ? '#DIV/0!' : l / r;
          case '%': return l % r;
          case '^': return Math.pow(l, r);
          default: return '#ERROR!';
        }
      }

      case 'UNARY_OP': {
        const operand = this.evaluateNode(node.operand!);
        if (typeof operand === 'string' && operand.startsWith('#')) return operand;
        const val = typeof operand === 'number' ? operand : parseFloat(operand as string);
        if (isNaN(val)) return '#ERROR!';
        return node.operator === '-' ? -val : val;
      }

      case 'FUNCTION':
        return this.evaluateFunction(node.name!, node.args || []);

      default:
        return '#ERROR!';
    }
  }

  private evaluateFunction(name: string, args: FormulaNode[]): string | number {
    switch (name.toUpperCase()) {
      case 'SUM': {
        let total = 0;
        for (const arg of args) {
          const val = this.evaluateNode(arg);
          if (typeof val === 'string' && val.startsWith('#')) return val;
          if (Array.isArray(val)) {
            total += val.reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
          } else {
            const num = typeof val === 'number' ? val : parseFloat(val as string);
            if (!isNaN(num)) total += num;
          }
        }
        return total;
      }

      case 'AVERAGE': {
        let total = 0;
        let count = 0;
        for (const arg of args) {
          const val = this.evaluateNode(arg);
          if (typeof val === 'string' && val.startsWith('#')) return val;
          if (Array.isArray(val)) {
            const nums = val.filter(v => typeof v === 'number') as number[];
            total += nums.reduce((sum, v) => sum + v, 0);
            count += nums.length;
          } else {
            const num = typeof val === 'number' ? val : parseFloat(val as string);
            if (!isNaN(num)) {
              total += num;
              count++;
            }
          }
        }
        return count === 0 ? '#DIV/0!' : total / count;
      }

      case 'COUNT': {
        let count = 0;
        for (const arg of args) {
          const val = this.evaluateNode(arg);
          if (typeof val === 'string' && val.startsWith('#')) return val;
          if (Array.isArray(val)) {
            count += val.filter(v => typeof v === 'number').length;
          } else if (typeof val === 'number') {
            count++;
          }
        }
        return count;
      }

      case 'COUNTA': {
        let count = 0;
        for (const arg of args) {
          const val = this.evaluateNode(arg);
          if (typeof val === 'string' && val.startsWith('#')) return val;
          if (Array.isArray(val)) {
            count += val.filter(v => v !== 0).length;
          } else if (val !== 0 && val !== '') {
            count++;
          }
        }
        return count;
      }

      case 'MAX': {
        let max = -Infinity;
        for (const arg of args) {
          const val = this.evaluateNode(arg);
          if (typeof val === 'string' && val.startsWith('#')) return val;
          if (Array.isArray(val)) {
            const nums = val.filter(v => typeof v === 'number') as number[];
            if (nums.length > 0) {
              max = Math.max(max, ...nums);
            }
          } else {
            const num = typeof val === 'number' ? val : parseFloat(val as string);
            if (!isNaN(num)) max = Math.max(max, num);
          }
        }
        return max === -Infinity ? 0 : max;
      }

      case 'MIN': {
        let min = Infinity;
        for (const arg of args) {
          const val = this.evaluateNode(arg);
          if (typeof val === 'string' && val.startsWith('#')) return val;
          if (Array.isArray(val)) {
            const nums = val.filter(v => typeof v === 'number') as number[];
            if (nums.length > 0) {
              min = Math.min(min, ...nums);
            }
          } else {
            const num = typeof val === 'number' ? val : parseFloat(val as string);
            if (!isNaN(num)) min = Math.min(min, num);
          }
        }
        return min === Infinity ? 0 : min;
      }

      case 'ABS': {
        if (args.length !== 1) return '#ERROR!';
        const val = this.evaluateNode(args[0]);
        if (typeof val === 'string' && val.startsWith('#')) return val;
        const num = typeof val === 'number' ? val : parseFloat(val as string);
        return isNaN(num) ? '#ERROR!' : Math.abs(num);
      }

      case 'ROUND': {
        if (args.length < 1 || args.length > 2) return '#ERROR!';
        const val = this.evaluateNode(args[0]);
        if (typeof val === 'string' && val.startsWith('#')) return val;
        const num = typeof val === 'number' ? val : parseFloat(val as string);
        if (isNaN(num)) return '#ERROR!';

        const decimals = args.length === 2 ? this.evaluateNode(args[1]) : 0;
        const dec = typeof decimals === 'number' ? decimals : parseInt(decimals as string);
        return isNaN(dec) ? '#ERROR!' : Number(num.toFixed(dec));
      }

      case 'SQRT': {
        if (args.length !== 1) return '#ERROR!';
        const val = this.evaluateNode(args[0]);
        if (typeof val === 'string' && val.startsWith('#')) return val;
        const num = typeof val === 'number' ? val : parseFloat(val as string);
        return isNaN(num) || num < 0 ? '#ERROR!' : Math.sqrt(num);
      }

      case 'POWER': {
        if (args.length !== 2) return '#ERROR!';
        const base = this.evaluateNode(args[0]);
        const exp = this.evaluateNode(args[1]);
        if (typeof base === 'string' && base.startsWith('#')) return base;
        if (typeof exp === 'string' && exp.startsWith('#')) return exp;
        const b = typeof base === 'number' ? base : parseFloat(base as string);
        const e = typeof exp === 'number' ? exp : parseFloat(exp as string);
        return isNaN(b) || isNaN(e) ? '#ERROR!' : Math.pow(b, e);
      }

      case 'IF': {
        if (args.length !== 3) return '#ERROR!';
        const condition = this.evaluateNode(args[0]);
        if (typeof condition === 'string' && condition.startsWith('#')) return condition;
        if (Array.isArray(condition)) return '#ERROR!';
        const cond = typeof condition === 'number' ? condition : parseFloat(condition as string);
        const result = cond ? this.evaluateNode(args[1]) : this.evaluateNode(args[2]);
        if (Array.isArray(result)) return '#ERROR!';
        return result;
      }

      case 'CONCAT': {
        let result = '';
        for (const arg of args) {
          const val = this.evaluateNode(arg);
          if (typeof val === 'string' && val.startsWith('#')) return val;
          if (Array.isArray(val)) {
            result += val.map(v => String(v)).join('');
          } else {
            result += String(val);
          }
        }
        return result;
      }

      case 'LEN': {
        if (args.length !== 1) return '#ERROR!';
        const val = this.evaluateNode(args[0]);
        if (typeof val === 'string' && val.startsWith('#')) return val;
        return String(val).length;
      }

      case 'UPPER': {
        if (args.length !== 1) return '#ERROR!';
        const val = this.evaluateNode(args[0]);
        if (typeof val === 'string' && val.startsWith('#')) return val;
        return String(val).toUpperCase();
      }

      case 'LOWER': {
        if (args.length !== 1) return '#ERROR!';
        const val = this.evaluateNode(args[0]);
        if (typeof val === 'string' && val.startsWith('#')) return val;
        return String(val).toLowerCase();
      }

      case 'NOW': {
        return new Date().toLocaleString();
      }

      case 'TODAY': {
        return new Date().toLocaleDateString();
      }

      default:
        return '#ERROR!';
    }
  }
}
