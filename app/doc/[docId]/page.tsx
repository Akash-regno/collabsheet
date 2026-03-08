'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Document } from '@/types';
import { Spreadsheet } from '@/components/editor/Spreadsheet';
import { SpreadsheetHeader } from '@/components/editor/SpreadsheetHeader';

export default function DocumentPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const docId = params.docId as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !docId) return;

    const docRef = doc(db, 'documents', docId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setDocument({
          id: snapshot.id,
          title: data.title,
          owner_id: data.owner_id,
          created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
          updated_at: data.updated_at?.toDate().toISOString() || new Date().toISOString(),
        });
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, docId, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user || !document) return null;

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <SpreadsheetHeader document={document} />
      <Spreadsheet documentId={docId} userId={user.id} userName={user.displayName} />
    </div>
  );
}
