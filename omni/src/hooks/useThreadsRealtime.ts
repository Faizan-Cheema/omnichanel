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
        { event: '*', schema: 'public', table: 'contact' },
        (payload) => {
          const timestamp = new Date().toISOString();
          console.log('📡 [Threads] Realtime event received!');
          console.log('   Timestamp:', timestamp);
          console.log('   Event Type:', payload.eventType);
          console.log('   New Data:', payload.new);
          console.log('   Old Data:', payload.old);
          console.log('   Full Payload:', payload);
          console.log('----------------------------------------');
          onRefreshRef.current();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_message' },
        (payload) => {
          console.log('[Realtime] contact_message INSERT (threads refresh)', payload.new);
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
