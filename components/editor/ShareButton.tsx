'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ShareButtonProps {
  documentId: string;
}

export function ShareButton({ documentId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/doc/${documentId}` 
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-slate-900/50 border-slate-700/50 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <Share2 className="h-4 w-4 relative z-10 group-hover:text-purple-400 transition-colors" />
          <span className="relative z-10 group-hover:text-purple-300 transition-colors">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-xl border-slate-800/50">
        <DialogHeader>
          <DialogTitle className="text-slate-100 text-xl flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-600/20">
              <Share2 className="h-5 w-5 text-purple-400" />
            </div>
            Share this spreadsheet
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Anyone with this link can view and edit this spreadsheet
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              readOnly
              value={shareUrl}
              className="font-mono text-sm bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-purple-500/50 focus:ring-purple-500/20"
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          Share this link with others to collaborate in real-time
        </p>
      </DialogContent>
    </Dialog>
  );
}
