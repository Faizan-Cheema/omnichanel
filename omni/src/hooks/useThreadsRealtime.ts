'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Subscribes to Supabase Realtime for INSERT/UPDATE on contacts and INSERT on messages.
 * Triggers onRefresh when the thread list should be updated (new contact or new message).
 */
export function useThreadsRealtime(onRefresh: () => void) {
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    const channel = supabase
      .channel('threads-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts' },
        (payload) => {
          console.log('[Realtime] contacts', payload.eventType, payload.new ?? payload.old);
          onRefreshRef.current();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('[Realtime] messages INSERT (threads refresh)', payload.new);
          onRefreshRef.current();
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] threads channel status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
