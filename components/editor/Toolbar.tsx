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
    <div className="h-12 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-sm flex items-center px-4 gap-2 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5"></div>
      
      <div className="flex items-center gap-2 relative z-10">
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            'h-8 w-8 p-0 transition-all duration-200',
            selectedCell?.bold 
              ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' 
              : 'text-slate-400 hover:text-purple-400 hover:bg-purple-500/10'
          )}
          onClick={() => onFormatChange({ bold: !selectedCell?.bold })}
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className={cn(
            'h-8 w-8 p-0 transition-all duration-200',
            selectedCell?.italic 
              ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' 
              : 'text-slate-400 hover:text-purple-400 hover:bg-purple-500/10'
          )}
          onClick={() => onFormatChange({ italic: !selectedCell?.italic })}
        >
          <Italic className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-slate-700/50 mx-2" />

        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all">
              <div className="relative">
                <Palette className="w-4 h-4" />
                {selectedCell?.textColor && (
                  <div
                    className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-slate-900 ring-1 ring-purple-500/30"
                    style={{ backgroundColor: selectedCell.textColor }}
                  />
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-slate-900/95 backdrop-blur-xl border-slate-800/50">
            <div className="space-y-2">
              <p className="text-xs font-medium text-purple-400">Text Color</p>
              <div className="grid grid-cols-10 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-slate-700/50 hover:scale-110 hover:ring-2 hover:ring-purple-500/50 transition-all"
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
            <Button size="sm" variant="ghost" className="h-8 px-3 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-slate-700/50 ring-1 ring-purple-500/20"
                  style={{ backgroundColor: selectedCell?.bgColor || 'transparent' }}
                />
                <span className="text-xs">Fill</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-slate-900/95 backdrop-blur-xl border-slate-800/50">
            <div className="space-y-2">
              <p className="text-xs font-medium text-purple-400">Background Color</p>
              <div className="grid grid-cols-10 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-slate-700/50 hover:scale-110 hover:ring-2 hover:ring-purple-500/50 transition-all"
                    style={{ backgroundColor: color }}
                    onClick={() => onFormatChange({ bgColor: color })}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1" />

      <Popover open={showExport} onOpenChange={setShowExport}>
        <PopoverTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 border-slate-700/50 bg-slate-900/50 text-slate-300 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-300 transition-all duration-300 group relative overflow-hidden z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Download className="w-4 h-4 mr-2 relative z-10 group-hover:scale-110 transition-transform" />
            <span className="relative z-10">Export</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 bg-slate-900/95 backdrop-blur-xl border-slate-800/50">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:bg-purple-500/10 hover:text-purple-300 transition-all"
              onClick={() => {
                onExportCSV();
                setShowExport(false);
              }}
            >
              <span className="text-sm">📄 Export as CSV</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:bg-purple-500/10 hover:text-purple-300 transition-all"
              onClick={() => {
                onExportJSON();
                setShowExport(false);
              }}
            >
              <span className="text-sm">📋 Export as JSON</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
