'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribes to Supabase Realtime for INSERT events on the contact_message table.
 * Only triggers onNewMessage when the new message belongs to the current conversation
 * (matched by "conversation_id" containing the conversation identifier, e.g. phone_number).
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
        { event: '*', schema: 'public', table: 'contact_message' },
        (payload) => {
          const newRow = payload.new as { conversation_id?: string };
          const conversation_id = newRow?.conversation_id ?? '';
          const belongsToConversation = conversation_id === currentConversationId;

          const timestamp = new Date().toISOString();
          console.log('📡 [Messages] Realtime event received!');
          console.log('   Timestamp:', timestamp);
          console.log('   Event Type:', payload.eventType);
          console.log('   New Data:', payload.new);
          console.log('   Old Data:', payload.old);
          console.log('   Full Payload:', payload);
          console.log('   Belongs to current conversation:', belongsToConversation);
          console.log('----------------------------------------');

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
