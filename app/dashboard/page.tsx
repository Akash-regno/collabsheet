'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
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
import { Particles } from '@/components/ui/particles';

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <Particles />
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-40 right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
      
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              My Spreadsheets
            </h1>
            <p className="text-slate-400 text-lg">Welcome back, <span className="text-purple-400 font-medium">{user.displayName}</span></p>
          </div>
          <Button 
            onClick={() => setShowLogoutDialog(true)} 
            variant="outline" 
            className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm text-slate-300 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <LogOut className="w-4 h-4 mr-2 relative z-10 group-hover:scale-110 transition-transform" />
            <span className="relative z-10">Sign Out</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            onClick={createDocument}
            className="border-2 border-dashed border-slate-700/50 bg-slate-900/30 backdrop-blur-sm hover:bg-slate-800/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group relative overflow-hidden hover-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
            <CardContent className="flex flex-col items-center justify-center h-48 relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Plus className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors relative z-10" />
              </div>
              <p className="text-slate-300 font-medium group-hover:text-purple-300 transition-colors">Create New Spreadsheet</p>
            </CardContent>
          </Card>

          {documents.map((doc, index) => (
            <Card
              key={doc.id}
              className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/70 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden hover-glow"
              onClick={() => router.push(`/doc/${doc.id}`)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-300"></div>
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-600/20 group-hover:from-purple-600/30 group-hover:to-indigo-600/30 transition-all duration-300">
                    <FileSpreadsheet className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
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
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
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
                  <div onClick={(e) => e.stopPropagation()} className="mt-4">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-purple-500/50 focus:ring-purple-500/20"
                      autoFocus
                    />
                  </div>
                ) : (
                  <CardTitle className="text-slate-100 mt-4 group-hover:text-purple-300 transition-colors">{doc.title}</CardTitle>
                )}
                <CardDescription className="text-slate-500 mt-2">
                  Updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 mb-6">
              <FileSpreadsheet className="w-16 h-16 text-slate-700 mx-auto" />
            </div>
            <p className="text-slate-400 text-lg">No spreadsheets yet. Create your first one!</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border-slate-800/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100 text-xl">Delete Spreadsheet</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-base">
              Are you sure you want to delete this spreadsheet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-800">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteDocument} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border-slate-800/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100 text-xl flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-600/20">
                <LogOut className="h-5 w-5 text-red-400" />
              </div>
              Sign Out
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-base">
              Are you sure you want to sign out? You'll need to sign in again to access your spreadsheets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-800 transition-all">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                signOut();
                setShowLogoutDialog(false);
              }} 
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
