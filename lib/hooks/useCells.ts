'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { Cell, CellData } from '@/types';
import { evaluateFormula } from '../formula';

export function useCells(documentId: string | null) {
  const [cells, setCells] = useState<Map<string, CellData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const updateTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    const cellsRef = collection(db, 'documents', documentId, 'cells');
    
    const unsubscribe = onSnapshot(cellsRef, (snapshot) => {
      const cellMap = new Map<string, CellData>();
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        cellMap.set(data.cell_address, {
          value: data.value || '',
          formula: data.formula || undefined,
          bold: data.bold || false,
          italic: data.italic || false,
          textColor: data.text_color || undefined,
          bgColor: data.bg_color || undefined,
        });
      });

      setCells(cellMap);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      updateTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, [documentId]);

  const updateCell = useCallback(
    async (address: string, data: Partial<CellData>, userId: string) => {
      if (!documentId) return;

      const existingTimer = updateTimers.current.get(address);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Optimistic update
      setCells((prev) => {
        const next = new Map(prev);
        const current = next.get(address) || {
          value: '',
          bold: false,
          italic: false,
        };

        const updated = { ...current, ...data };

        if (updated.formula) {
          const evaluatedValue = evaluateFormula(updated.formula, next, address);
          updated.value = evaluatedValue;
        }

        next.set(address, updated);
        return next;
      });

      // Debounced write
      const timer = setTimeout(async () => {
        setSaving(true);
        const cellData = cells.get(address) || {
          value: '',
          bold: false,
          italic: false,
        };
        const finalData = { ...cellData, ...data };

        if (finalData.formula) {
          const evaluatedValue = evaluateFormula(finalData.formula, cells, address);
          finalData.value = evaluatedValue;
        }

        try {
          const cellRef = doc(db, 'documents', documentId, 'cells', address);
          await setDoc(cellRef, {
            cell_address: address,
            value: finalData.value,
            formula: finalData.formula || null,
            bold: finalData.bold || false,
            italic: finalData.italic || false,
            text_color: finalData.textColor || null,
            bg_color: finalData.bgColor || null,
            updated_by: userId,
            updated_at: Timestamp.now(),
          }, { merge: true });
        } catch (error) {
          console.error('Error updating cell:', error);
        }

        setSaving(false);
        updateTimers.current.delete(address);
      }, 400);

      updateTimers.current.set(address, timer);
    },
    [documentId, cells]
  );

  return { cells, loading, saving, updateCell };
}
