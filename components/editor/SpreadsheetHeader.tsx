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
    <div className="h-14 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl flex items-center px-4 gap-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5"></div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/dashboard')}
        className="text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all relative z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex items-center gap-2 flex-1 relative z-10">
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
              className="h-8 bg-slate-800/50 border-slate-700/50 text-slate-100 max-w-md focus:border-purple-500/50 focus:ring-purple-500/20"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={saveTitle} className="h-8 w-8 p-0 hover:bg-green-500/10">
              <Check className="w-4 h-4 text-green-400" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{document.title}</h1>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-500/10"
            >
              <Edit2 className="w-4 h-4 text-purple-400" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <ShareButton documentId={document.id} />
      </div>
    </div>
  );
}
