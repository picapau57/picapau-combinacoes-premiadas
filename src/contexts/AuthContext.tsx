import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export type PaymentStatus = 'aguardando' | 'comprovante_enviado' | 'liberado' | 'bloqueado';
export interface Profile {
  id: string; full_name: string; whatsapp: string; username: string;
  payment_status: PaymentStatus; is_admin: boolean;
  released_at: string | null; created_at: string;
}
interface AuthContextType {
  user: User | null; profile: Profile | null; session: Session | null; loading: boolean;
  signUp: (data: { email: string; password: string; fullName: string; whatsapp: string; username: string; }) => Promise<{ error?: string }>;
  signIn: (username: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data as Profile | null);
  }
  async function refreshProfile() { if (user) await loadProfile(user.id); }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session); setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id); else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signUp({ email, password, fullName, whatsapp, username }: any) {
    const { data, error } = await supabase.auth.signUp({ email, password,
      options: { data: { full_name: fullName, whatsapp, username } } });
    if (error) return { error: error.message };
    if (data.user) {
      const { error: insertError } = await supabase.from('profiles').insert({
        id: data.user.id, full_name: fullName, whatsapp, username,
        payment_status: 'aguardando',
        is_admin: email === import.meta.env.VITE_ADMIN_EMAIL
      });
      if (insertError) return { error: insertError.message };
    }
    return {};
  }

  async function signIn(username: string, password: string) {
    const { data: prof } = await supabase.from('profiles').select('id,email').eq('username', username).maybeSingle();
    if (!prof || !(prof as any).email) return { error: 'Usuário não encontrado' };
    const { error } = await supabase.auth.signInWithPassword({ email: (prof as any).email, password });
    if (error) return { error: error.message };
    return {};
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setSession(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fora do AuthProvider');
  return ctx;
}
