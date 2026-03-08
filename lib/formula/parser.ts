import { FormulaToken, FormulaNode } from '@/types';

export class Parser {
  private tokens: FormulaToken[];
  private pos: number;

  constructor(tokens: FormulaToken[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  parse(): FormulaNode {
    return this.parseExpression();
  }

  private current(): FormulaToken | null {
    return this.tokens[this.pos] || null;
  }

  private advance(): void {
    this.pos++;
  }

  private parseExpression(): FormulaNode {
    return this.parseAdditive();
  }

  private parseAdditive(): FormulaNode {
    let left = this.parseMultiplicative();

    while (this.current()?.type === 'OPERATOR' &&
           ['+', '-'].includes(this.current()!.value)) {
      const operator = this.current()!.value;
      this.advance();
      const right = this.parseMultiplicative();
      left = {
        type: 'BINARY_OP',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseMultiplicative(): FormulaNode {
    let left = this.parsePower();

    while (this.current()?.type === 'OPERATOR' &&
           ['*', '/', '%'].includes(this.current()!.value)) {
      const operator = this.current()!.value;
      this.advance();
      const right = this.parsePower();
      left = {
        type: 'BINARY_OP',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parsePower(): FormulaNode {
    let left = this.parseUnary();

    while (this.current()?.type === 'OPERATOR' && this.current()!.value === '^') {
      const operator = this.current()!.value;
      this.advance();
      const right = this.parseUnary();
      left = {
        type: 'BINARY_OP',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseUnary(): FormulaNode {
    if (this.current()?.type === 'OPERATOR' && this.current()!.value === '-') {
      this.advance();
      return {
        type: 'UNARY_OP',
        operator: '-',
        operand: this.parseUnary(),
      };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): FormulaNode {
    const token = this.current();

    if (!token) {
      throw new Error('Unexpected end of expression');
    }

    if (token.type === 'NUMBER') {
      this.advance();
      return {
        type: 'NUMBER',
        value: parseFloat(token.value),
      };
    }

    if (token.type === 'STRING') {
      this.advance();
      return {
        type: 'STRING',
        value: token.value,
      };
    }

    if (token.type === 'CELL_REF') {
      this.advance();
      return {
        type: 'CELL_REF',
        value: token.value,
      };
    }

    if (token.type === 'RANGE') {
      this.advance();
      return {
        type: 'RANGE',
        value: token.value,
      };
    }

    if (token.type === 'FUNCTION') {
      const name = token.value;
      this.advance();

      if (this.current()?.type !== 'LPAREN') {
        throw new Error(`Expected '(' after function ${name}`);
      }
      this.advance();

      const args: FormulaNode[] = [];
      if (this.current()?.type !== 'RPAREN') {
        args.push(this.parseExpression());
        while (this.current()?.type === 'COMMA') {
          this.advance();
          args.push(this.parseExpression());
        }
      }

      if (this.current()?.type !== 'RPAREN') {
        throw new Error(`Expected ')' after function arguments`);
      }
      this.advance();

      return {
        type: 'FUNCTION',
        name,
        args,
      };
    }

    if (token.type === 'LPAREN') {
      this.advance();
      const expr = this.parseExpression();
      if (this.current()?.type !== 'RPAREN') {
        throw new Error(`Expected ')'`);
      }
      this.advance();
      return expr;
    }

    throw new Error(`Unexpected token: ${token.type}`);
  }
}
