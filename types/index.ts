export interface Document {
  id: string;
  title: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Cell {
  id: string;
  document_id: string;
  cell_address: string;
  value: string;
  formula: string | null;
  bold: boolean;
  italic: boolean;
  text_color: string | null;
  bg_color: string | null;
  updated_by: string | null;
  updated_at: string;
}

export interface Presence {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  user_email: string | null;
  selected_cell: string | null;
  last_seen: string;
}

export interface CellData {
  value: string;
  formula?: string;
  bold?: boolean;
  italic?: boolean;
  textColor?: string;
  bgColor?: string;
}

export interface User {
  id: string;
  email?: string;
  displayName: string;
}

export interface FormulaToken {
  type: 'NUMBER' | 'STRING' | 'CELL_REF' | 'RANGE' | 'FUNCTION' | 'OPERATOR' | 'LPAREN' | 'RPAREN' | 'COMMA';
  value: string;
}

export interface FormulaNode {
  type: 'NUMBER' | 'STRING' | 'CELL_REF' | 'RANGE' | 'FUNCTION' | 'BINARY_OP' | 'UNARY_OP';
  value?: string | number;
  operator?: string;
  left?: FormulaNode;
  right?: FormulaNode;
  operand?: FormulaNode;
  name?: string;
  args?: FormulaNode[];
}
