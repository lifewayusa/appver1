import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';

/**
 * Hook para controlar o fluxo de autenticação e perfil conforme o FluxoAutenticacao.md
 * - Redireciona visitantes para login se necessário
 * - Redireciona usuário autenticado sem perfil completo para o MultiStepForm
 * - Retorna user, profile e nível de acesso
 */
export function useAuthFlow({ requireAuth = false, requireProfileComplete = false, requireRole } = {}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessLevel, setAccessLevel] = useState('visitor');

  useEffect(() => {
    let ignore = false;
    async function checkAuth() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAccessLevel('visitor');
        setUser(null);
        setProfile(null);
        setLoading(false);
        if (requireAuth) router.push('/login');
        return;
      }
      setUser(user);
      // Busca perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setProfile(profile);
      // Determina nível de acesso
      if (!profile) {
        setAccessLevel('registered');
        if (requireProfileComplete) router.push('/multistepform');
      } else if (!profile.is_completed) {
        setAccessLevel('registered');
        if (requireProfileComplete) router.push('/multistepform');
      } else if (profile.role === 'admin') {
        setAccessLevel('admin');
      } else if (profile.role === 'editor') {
        setAccessLevel('editor');
      } else {
        setAccessLevel('advanced');
      }
      // Redireciona se não tiver o role exigido
      if (requireRole && profile?.role !== requireRole) {
        router.push('/');
      }
      setLoading(false);
    }
    checkAuth();
    return () => { ignore = true; };
  }, [requireAuth, requireProfileComplete, requireRole, router]);

  return { user, profile, accessLevel, loading };
}
