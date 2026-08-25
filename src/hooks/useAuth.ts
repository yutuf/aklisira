import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../utils/supabase-client';

export type Plan = 'free' | 'pro';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [plan, setPlan] = useState<Plan>('free');
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) {
      setPlan('free');
      return;
    }
    supabase
      .from('profiles')
      .select('plan')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data?.plan === 'pro') setPlan('pro');
      });
  }, [session]);

  const signInWithEmail = async (email: string) => {
    if (!supabase) throw new Error('Supabase yapılandırılmamış.');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return { session, plan, loading, signInWithEmail, signOut, configured: isSupabaseConfigured };
}
