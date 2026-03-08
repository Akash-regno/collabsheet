'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { Document } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { FileSpreadsheet, Plus, Trash2, Edit2, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const documentsRef = collection(db, 'documents');
    const q = query(
      documentsRef,
      where('owner_id', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Document[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({
          id: doc.id,
          title: data.title,
          owner_id: data.owner_id,
          created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
          updated_at: data.updated_at?.toDate().toISOString() || new Date().toISOString(),
        });
      });
      // Sort in memory instead of in query
      docs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setDocuments(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createDocument = async () => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, 'documents'), {
        title: 'Untitled Spreadsheet',
        owner_id: user.id,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
      router.push(`/doc/${docRef.id}`);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const startEdit = (doc: Document) => {
    setEditingId(doc.id);
    setEditTitle(doc.title);
  };

  const saveEdit = async () => {
    if (!editingId || !editTitle.trim()) return;

    try {
      const docRef = doc(db, 'documents', editingId);
      await updateDoc(docRef, {
        title: editTitle,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating document:', error);
    }

    setEditingId(null);
    setEditTitle('');
  };

  const deleteDocument = async () => {
    if (!deleteId) return;

    try {
      await deleteDoc(doc(db, 'documents', deleteId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }

    setDeleteId(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">My Spreadsheets</h1>
            <p className="text-slate-400">Welcome back, {user.displayName}</p>
          </div>
          <Button onClick={signOut} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            onClick={createDocument}
            className="border-2 border-dashed border-slate-700 bg-slate-900/30 hover:bg-slate-800/50 hover:border-indigo-500 transition-all cursor-pointer group"
          >
            <CardContent className="flex flex-col items-center justify-center h-48">
              <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4 group-hover:bg-indigo-600/30 transition-colors">
                <Plus className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-slate-300 font-medium">Create New Spreadsheet</p>
            </CardContent>
          </Card>

          {documents.map((doc) => (
            <Card
              key={doc.id}
              className="border-slate-800 bg-slate-900/50 hover:bg-slate-800/70 transition-all group cursor-pointer"
              onClick={() => router.push(`/doc/${doc.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileSpreadsheet className="w-8 h-8 text-indigo-400 mb-2" />
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(doc);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(doc.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {editingId === doc.id ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="bg-slate-800 border-slate-700 text-slate-100"
                      autoFocus
                    />
                  </div>
                ) : (
                  <CardTitle className="text-slate-100">{doc.title}</CardTitle>
                )}
                <CardDescription className="text-slate-500">
                  Updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-12">
            <FileSpreadsheet className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No spreadsheets yet. Create your first one!</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100">Delete Spreadsheet</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this spreadsheet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-slate-300 border-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteDocument} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
