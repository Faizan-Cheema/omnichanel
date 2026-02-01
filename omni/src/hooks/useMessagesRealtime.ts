'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribes to Supabase Realtime for INSERT events on the messages table.
 * Only triggers onNewMessage when the new message belongs to the current conversation
 * (matched by "from" or "to" containing the conversation identifier, e.g. phone_number).
 */
export function useMessagesRealtime(
  currentConversationId: string | null,
  onNewMessage: () => void
) {
  const onNewMessageRef = useRef(onNewMessage);
  onNewMessageRef.current = onNewMessage;

  useEffect(() => {
    if (!currentConversationId) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newRow = payload.new as { from?: string; to?: string };
          const from = newRow?.from ?? '';
          const to = newRow?.to ?? '';

          const belongsToConversation =
            from === currentConversationId || to === currentConversationId;

          console.log('[Realtime] messages INSERT', { from, to, currentConversationId, belongsToConversation, payload: payload.new });
          if (belongsToConversation) {
            onNewMessageRef.current();
          }
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] messages channel status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversationId]);
}
