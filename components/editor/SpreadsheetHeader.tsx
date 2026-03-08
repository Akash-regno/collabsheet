'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Document } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { ArrowLeft, Edit2, Check } from 'lucide-react';
import { ShareButton } from './ShareButton';

interface SpreadsheetHeaderProps {
  document: Document;
}

export function SpreadsheetHeader({ document }: SpreadsheetHeaderProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(document.title);

  const saveTitle = async () => {
    if (!title.trim()) {
      setTitle(document.title);
      setIsEditing(false);
      return;
    }

    try {
      const docRef = doc(db, 'documents', document.id);
      await updateDoc(docRef, {
        title,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating title:', error);
      setTitle(document.title);
    }

    setIsEditing(false);
  };

  return (
    <div className="h-14 border-b border-slate-800 bg-slate-900 flex items-center px-4 gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/')}
        className="text-slate-400 hover:text-slate-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex items-center gap-2 flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveTitle();
                if (e.key === 'Escape') {
                  setTitle(document.title);
                  setIsEditing(false);
                }
              }}
              className="h-8 bg-slate-800 border-slate-700 text-slate-100 max-w-md"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={saveTitle} className="h-8 w-8 p-0">
              <Check className="w-4 h-4 text-green-400" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <h1 className="text-lg font-semibold text-slate-100">{document.title}</h1>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        )}
      </div>

      <ShareButton documentId={document.id} />
    </div>
  );
}
