'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CellData } from '@/types';
import { Bold, Italic, Palette, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  selectedCell: CellData | null | undefined;
  onFormatChange: (format: { bold?: boolean; italic?: boolean; textColor?: string; bgColor?: string }) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ffffff',
  '#000000', '#64748b',
];

export function Toolbar({ selectedCell, onFormatChange, onExportCSV, onExportJSON }: ToolbarProps) {
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="h-12 border-b border-slate-800 bg-slate-900 flex items-center px-4 gap-2">
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          'h-8 w-8 p-0',
          selectedCell?.bold ? 'bg-slate-700 text-slate-100' : 'text-slate-400'
        )}
        onClick={() => onFormatChange({ bold: !selectedCell?.bold })}
      >
        <Bold className="w-4 h-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={cn(
          'h-8 w-8 p-0',
          selectedCell?.italic ? 'bg-slate-700 text-slate-100' : 'text-slate-400'
        )}
        onClick={() => onFormatChange({ italic: !selectedCell?.italic })}
      >
        <Italic className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-slate-700 mx-2" />

      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400">
            <div className="relative">
              <Palette className="w-4 h-4" />
              {selectedCell?.textColor && (
                <div
                  className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-slate-900"
                  style={{ backgroundColor: selectedCell.textColor }}
                />
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-slate-900 border-slate-800">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400">Text Color</p>
            <div className="grid grid-cols-10 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-slate-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => onFormatChange({ textColor: color })}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 px-3 text-slate-400">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-slate-700"
                style={{ backgroundColor: selectedCell?.bgColor || 'transparent' }}
              />
              <span className="text-xs">Fill</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-slate-900 border-slate-800">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400">Background Color</p>
            <div className="grid grid-cols-10 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-slate-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => onFormatChange({ bgColor: color })}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex-1" />

      <Popover open={showExport} onOpenChange={setShowExport}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="h-8 border-slate-700 text-slate-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 bg-slate-900 border-slate-800">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:bg-slate-800"
              onClick={() => {
                onExportCSV();
                setShowExport(false);
              }}
            >
              Export as CSV
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:bg-slate-800"
              onClick={() => {
                onExportJSON();
                setShowExport(false);
              }}
            >
              Export as JSON
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
