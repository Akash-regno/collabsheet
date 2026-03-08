'use client';

import { useEffect, useState, useCallback } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, set, onValue, onDisconnect, serverTimestamp } from 'firebase/database';
import { Presence } from '@/types';

export function usePresence(documentId: string | null, userId: string | null, userName: string) {
  const [presence, setPresence] = useState<Presence[]>([]);

  useEffect(() => {
    if (!documentId || !userId) return;

    const presenceRef = ref(rtdb, `presence/${documentId}`);
    const userPresenceRef = ref(rtdb, `presence/${documentId}/${userId}`);

    // Set user presence
    const userPresenceData = {
      user_id: userId,
      user_name: userName,
      selected_cell: null,
      last_seen: serverTimestamp(),
    };

    set(userPresenceRef, userPresenceData);

    // Remove presence on disconnect
    onDisconnect(userPresenceRef).remove();

    // Listen to all presence
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const presenceData: Presence[] = [];
      const now = Date.now();
      
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const lastSeen = data.last_seen || 0;
        
        // Only include users active in last 10 seconds
        if (now - lastSeen < 10000) {
          presenceData.push({
            id: childSnapshot.key!,
            document_id: documentId,
            user_id: data.user_id,
            user_name: data.user_name,
            user_email: data.user_email || null,
            selected_cell: data.selected_cell || null,
            last_seen: new Date(lastSeen).toISOString(),
          });
        }
      });

      setPresence(presenceData);
    });

    // Heartbeat to keep presence alive
    const heartbeatInterval = setInterval(() => {
      set(userPresenceRef, {
        ...userPresenceData,
        last_seen: serverTimestamp(),
      });
    }, 3000);

    return () => {
      clearInterval(heartbeatInterval);
      unsubscribe();
      set(userPresenceRef, null);
    };
  }, [documentId, userId, userName]);

  const updateSelectedCell = useCallback(
    async (cellAddress: string | null) => {
      if (!documentId || !userId) return;

      const userPresenceRef = ref(rtdb, `presence/${documentId}/${userId}`);
      set(userPresenceRef, {
        user_id: userId,
        user_name: userName,
        selected_cell: cellAddress,
        last_seen: serverTimestamp(),
      });
    },
    [documentId, userId, userName]
  );

  return { presence, updateSelectedCell };
}
