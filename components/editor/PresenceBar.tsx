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
    <div className="h-10 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        {users.length > 0 && (
          <>
            <span className="text-xs text-slate-500">Active users:</span>
            <div className="flex -space-x-2">
              {users.slice(0, 5).map((user) => {
                const userColor = hashStringToColor(user.user_id);
                return (
                  <Avatar
                    key={user.id}
                    className="w-7 h-7 border-2 border-slate-900"
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
              <span className="text-xs text-slate-500">+{users.length - 5} more</span>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-xs text-slate-400">Saving...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">Saved</span>
          </>
        )}
      </div>
    </div>
  );
}
