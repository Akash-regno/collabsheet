'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FunctionSquare } from 'lucide-react';

interface FormulaBarProps {
  selectedAddress: string | null;
  value: string;
  onChange: (value: string) => void;
}

export function FormulaBar({ selectedAddress, value, onChange }: FormulaBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onChange(localValue);
    } else if (e.key === 'Escape') {
      setLocalValue(value);
    }
  };

  return (
    <div className="h-10 border-b border-slate-800 bg-slate-900 flex items-center px-4 gap-3">
      <div className="flex items-center gap-2 min-w-[80px]">
        <span className="text-xs font-semibold text-slate-400">
          {selectedAddress || 'A1'}
        </span>
      </div>

      <div className="w-px h-6 bg-slate-700" />

      <FunctionSquare className="w-4 h-4 text-slate-500" />

      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Enter value or formula (=SUM(A1:A10))"
        className="flex-1 h-7 bg-slate-800 border-slate-700 text-slate-100 text-sm"
      />
    </div>
  );
}
