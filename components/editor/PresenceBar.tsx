'use client';

import { Presence } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { hashStringToColor, getInitials } from '@/lib/utils/colorHash';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface PresenceBarProps {
  users: Presence[];
  saving: boolean;
}

export function PresenceBar({ users, saving }: PresenceBarProps) {
  return (
    <div className="h-10 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-between px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5"></div>
      
      <div className="flex items-center gap-2 relative z-10">
        {users.length > 0 && (
          <>
            <span className="text-xs text-slate-500 font-medium">Active users:</span>
            <div className="flex -space-x-2">
              {users.slice(0, 5).map((user) => {
                const userColor = hashStringToColor(user.user_id);
                return (
                  <Avatar
                    key={user.id}
                    className="w-7 h-7 border-2 border-slate-900 ring-1 ring-purple-500/20 hover:scale-110 transition-transform cursor-pointer"
                    style={{
                      backgroundColor: userColor,
                      boxShadow: `0 0 0 1px ${userColor}`,
                    }}
                  >
                    <AvatarFallback
                      className="text-xs font-semibold text-white"
                      style={{ backgroundColor: userColor }}
                    >
                      {getInitials(user.user_name)}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            {users.length > 5 && (
              <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full">+{users.length - 5}</span>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2 relative z-10">
        {saving ? (
          <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="text-xs text-amber-300 font-medium">Saving...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 group hover:bg-green-500/20 transition-all">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs text-green-300 font-medium">Saved</span>
          </div>
        )}
      </div>
    </div>
  );
}
