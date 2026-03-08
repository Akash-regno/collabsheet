'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useCells } from '@/lib/hooks/useCells';
import { usePresence } from '@/lib/hooks/usePresence';
import { cellToAddress } from '@/lib/utils/cellAddress';
import { Toolbar } from './Toolbar';
import { FormulaBar } from './FormulaBar';
import { PresenceBar } from './PresenceBar';
import { cn } from '@/lib/utils';
import { hashStringToColor } from '@/lib/utils/colorHash';

interface SpreadsheetProps {
  documentId: string;
  userId: string;
  userName: string;
}

const ROWS = 100;
const COLS = 26;
const DEFAULT_COL_WIDTH = 120;
const ROW_HEIGHT = 32;

export function Spreadsheet({ documentId, userId, userName }: SpreadsheetProps) {
  const { cells, loading, saving, updateCell } = useCells(documentId);
  const { presence, updateSelectedCell } = usePresence(documentId, userId, userName);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [columnWidths, setColumnWidths] = useState<Map<number, number>>(new Map());
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [rowHeights, setRowHeights] = useState<Map<number, number>>(new Map());
  const [resizingRow, setResizingRow] = useState<number | null>(null);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [resizeStartHeight, setResizeStartHeight] = useState(0);
  const [columnOrder, setColumnOrder] = useState<number[]>(Array.from({ length: COLS }, (_, i) => i));
  const [draggingColumn, setDraggingColumn] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const selectedAddress = selectedCell ? cellToAddress(selectedCell.row, selectedCell.col) : null;
  const selectedCellData = selectedAddress ? cells.get(selectedAddress) : null;

  // Auto-focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end
      inputRef.current.setSelectionRange(editValue.length, editValue.length);
    }
  }, [editingCell, editValue.length]);

  // Auto-focus grid on mount and select A1
  useEffect(() => {
    if (!selectedCell) {
      setSelectedCell({ row: 0, col: 0 });
    }
    gridRef.current?.focus();
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      updateSelectedCell(selectedAddress);
    }
  }, [selectedAddress, updateSelectedCell]);

  // Column resize handlers
  useEffect(() => {
    if (resizingColumn === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeStartX;
      const newWidth = Math.max(50, resizeStartWidth + delta);
      setColumnWidths(prev => new Map(prev).set(resizingColumn, newWidth));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, resizeStartX, resizeStartWidth]);

  // Row resize handlers
  useEffect(() => {
    if (resizingRow === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - resizeStartY;
      const newHeight = Math.max(24, resizeStartHeight + delta);
      setRowHeights(prev => new Map(prev).set(resizingRow, newHeight));
    };

    const handleMouseUp = () => {
      setResizingRow(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingRow, resizeStartY, resizeStartHeight]);

  const handleResizeStart = (col: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(col);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths.get(col) || DEFAULT_COL_WIDTH);
  };

  const handleRowResizeStart = (row: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingRow(row);
    setResizeStartY(e.clientY);
    setResizeStartHeight(rowHeights.get(row) || ROW_HEIGHT);
  };

  const getColumnWidth = (col: number) => {
    return columnWidths.get(col) || DEFAULT_COL_WIDTH;
  };

  const getRowHeight = (row: number) => {
    return rowHeights.get(row) || ROW_HEIGHT;
  };

  const handleColumnDragStart = (col: number, e: React.DragEvent) => {
    setDraggingColumn(col);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDragOver = (col: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(col);
  };

  const handleColumnDrop = (targetCol: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggingColumn === null || draggingColumn === targetCol) {
      setDraggingColumn(null);
      setDragOverColumn(null);
      return;
    }

    const newOrder = [...columnOrder];
    const dragIndex = newOrder.indexOf(draggingColumn);
    const targetIndex = newOrder.indexOf(targetCol);
    
    // Remove from old position and insert at new position
    newOrder.splice(dragIndex, 1);
    newOrder.splice(targetIndex, 0, draggingColumn);
    
    setColumnOrder(newOrder);
    setDraggingColumn(null);
    setDragOverColumn(null);
  };

  const handleColumnDragEnd = () => {
    setDraggingColumn(null);
    setDragOverColumn(null);
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setEditingCell(null);
    // Keep grid focused for keyboard input
    setTimeout(() => gridRef.current?.focus(), 0);
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    const address = cellToAddress(row, col);
    const cellData = cells.get(address);
    setEditingCell({ row, col });
    setSelectedCell({ row, col });
    setEditValue(cellData?.formula || cellData?.value || '');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedCell) return;

      // When editing, the input handles its own keys
      if (editingCell) {
        return;
      }

      if (e.key === 'Enter') {
        handleCellDoubleClick(selectedCell.row, selectedCell.col);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCell({ row: Math.max(selectedCell.row - 1, 0), col: selectedCell.col });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCell({ row: Math.min(selectedCell.row + 1, ROWS - 1), col: selectedCell.col });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedCell({ row: selectedCell.row, col: Math.max(selectedCell.col - 1, 0) });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedCell({ row: selectedCell.row, col: Math.min(selectedCell.col + 1, COLS - 1) });
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          setSelectedCell({ row: selectedCell.row, col: Math.max(selectedCell.col - 1, 0) });
        } else {
          setSelectedCell({ row: selectedCell.row, col: Math.min(selectedCell.col + 1, COLS - 1) });
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const address = cellToAddress(selectedCell.row, selectedCell.col);
        updateCell(address, { value: '', formula: undefined }, userId);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Start editing with the typed character
        e.preventDefault(); // Prevent the key from being typed twice
        setEditingCell(selectedCell);
        setEditValue(e.key);
      }
    },
    [selectedCell, editingCell, userId, updateCell]
  );

  const saveEdit = () => {
    if (!editingCell) return;

    const address = cellToAddress(editingCell.row, editingCell.col);
    if (editValue.startsWith('=')) {
      updateCell(address, { formula: editValue, value: '' }, userId);
    } else {
      updateCell(address, { value: editValue, formula: undefined }, userId);
    }

    setEditingCell(null);
    setEditValue('');
    // Refocus grid after editing
    setTimeout(() => gridRef.current?.focus(), 0);
  };

  const handleFormatChange = (format: { bold?: boolean; italic?: boolean; textColor?: string; bgColor?: string }) => {
    if (!selectedAddress) return;
    updateCell(selectedAddress, format, userId);
  };

  const exportToCSV = () => {
    let csv = '';
    for (let row = 0; row < ROWS; row++) {
      const rowData: string[] = [];
      for (let col = 0; col < COLS; col++) {
        const address = cellToAddress(row, col);
        const cell = cells.get(address);
        rowData.push(cell?.value || '');
      }
      csv += rowData.join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.csv';
    a.click();
  };

  const exportToJSON = () => {
    const data: Record<string, any> = {};
    cells.forEach((cell, address) => {
      data[address] = cell;
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.json';
    a.click();
  };

  const otherUsers = presence.filter((p) => p.user_id !== userId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PresenceBar users={otherUsers} saving={saving} />
      <Toolbar
        selectedCell={selectedCellData}
        onFormatChange={handleFormatChange}
        onExportCSV={exportToCSV}
        onExportJSON={exportToJSON}
      />
      <FormulaBar
        selectedAddress={selectedAddress}
        value={selectedCellData?.formula || selectedCellData?.value || ''}
        onChange={(value: string) => {
          if (selectedAddress) {
            if (value.startsWith('=')) {
              updateCell(selectedAddress, { formula: value, value: '' }, userId);
            } else {
              updateCell(selectedAddress, { value, formula: undefined }, userId);
            }
          }
        }}
      />

      <div
        ref={gridRef}
        className="flex-1 overflow-auto bg-slate-950"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="inline-block min-w-full">
          <div className="flex sticky top-0 z-20 bg-slate-900">
            <div className="w-12 h-8 border-r border-b border-slate-700 bg-slate-900 flex-shrink-0" />
            {columnOrder.map((col) => (
              <div
                key={col}
                draggable
                onDragStart={(e) => handleColumnDragStart(col, e)}
                onDragOver={(e) => handleColumnDragOver(col, e)}
                onDrop={(e) => handleColumnDrop(col, e)}
                onDragEnd={handleColumnDragEnd}
                className={cn(
                  "h-8 border-r border-b border-slate-700 bg-slate-900 flex items-center justify-center text-xs font-semibold text-slate-400 flex-shrink-0 relative group cursor-move",
                  draggingColumn === col && "opacity-50",
                  dragOverColumn === col && "bg-indigo-900"
                )}
                style={{ width: getColumnWidth(col) }}
              >
                {String.fromCharCode(65 + col)}
                <div
                  className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-slate-700 hover:bg-blue-500 hover:w-[3px] transition-all z-20"
                  onMouseDown={(e) => handleResizeStart(col, e)}
                  draggable={false}
                  style={{ 
                    backgroundColor: resizingColumn === col ? '#3b82f6' : undefined,
                    width: resizingColumn === col ? '3px' : undefined,
                  }}
                />
              </div>
            ))}
          </div>

          {Array.from({ length: ROWS }).map((_, row) => (
            <div key={row} className="flex">
              <div
                className="w-12 border-r border-b border-slate-700 bg-slate-900 flex items-center justify-center text-xs font-semibold text-slate-400 sticky left-0 z-10 flex-shrink-0 relative group"
                style={{ height: getRowHeight(row) }}
              >
                {row + 1}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 cursor-row-resize bg-slate-700 hover:bg-blue-500 hover:h-[3px] transition-all z-20"
                  onMouseDown={(e) => handleRowResizeStart(row, e)}
                  style={{ 
                    backgroundColor: resizingRow === row ? '#3b82f6' : undefined,
                    height: resizingRow === row ? '3px' : undefined,
                  }}
                />
              </div>
              {columnOrder.map((col) => {
                const address = cellToAddress(row, col);
                const cellData = cells.get(address);
                const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                const isEditing = editingCell?.row === row && editingCell?.col === col;
                const otherUserOnCell = otherUsers.find((u) => u.selected_cell === address);
                const cellColor = otherUserOnCell ? hashStringToColor(otherUserOnCell.user_id) : undefined;

                return (
                  <div
                    key={col}
                    className={cn(
                      'border-r border-b border-slate-700 flex items-center px-2 text-sm flex-shrink-0 relative overflow-visible',
                      isSelected && 'ring-2 ring-indigo-500 z-10',
                      otherUserOnCell && 'ring-2 z-10'
                    )}
                    style={{
                      width: getColumnWidth(col),
                      height: getRowHeight(row),
                      backgroundColor: cellData?.bgColor || 'transparent',
                      color: cellData?.textColor || '#f1f5f9',
                      fontWeight: cellData?.bold ? 'bold' : 'normal',
                      fontStyle: cellData?.italic ? 'italic' : 'normal',
                      boxShadow: cellColor ? `0 0 0 2px ${cellColor}` : undefined,
                    }}
                    onClick={() => handleCellClick(row, col)}
                    onDoubleClick={() => handleCellDoubleClick(row, col)}
                  >
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveEdit();
                            setSelectedCell({ row: Math.min(selectedCell!.row + 1, ROWS - 1), col: selectedCell!.col });
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            setEditingCell(null);
                            setEditValue('');
                            gridRef.current?.focus();
                          } else if (e.key === 'Tab') {
                            e.preventDefault();
                            saveEdit();
                            if (e.shiftKey) {
                              setSelectedCell({ row: selectedCell!.row, col: Math.max(selectedCell!.col - 1, 0) });
                            } else {
                              setSelectedCell({ row: selectedCell!.row, col: Math.min(selectedCell!.col + 1, COLS - 1) });
                            }
                          }
                          // Stop propagation for all keys so grid doesn't capture them
                          e.stopPropagation();
                        }}
                        className="w-full h-full bg-slate-800 outline-none text-slate-100 px-2 absolute inset-0 z-30"
                        style={{
                          minWidth: getColumnWidth(col),
                        }}
                      />
                    ) : (
                      <span className="truncate w-full">{cellData?.value || ''}</span>
                    )}
                    {otherUserOnCell && (
                      <div
                        className="absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap z-20"
                        style={{ backgroundColor: hashStringToColor(otherUserOnCell.user_id) }}
                      >
                        {otherUserOnCell.user_name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
