import Link from 'next/link';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiUser, FiSettings } from 'react-icons/fi';

export default function Header() {
  const { user, profile, accessLevel, loading } = useAuthFlow();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <Link href="/" className="text-xl font-bold text-blue-900">LifeWayUSA</Link>
      <nav className="flex items-center gap-4">
        <Link href="/blog">Blog</Link>
        {/* Outros links públicos aqui */}
        {!loading && !user && (
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Entrar</Link>
        )}
        {!loading && user && (
          <>
            <span className="flex items-center gap-2 text-gray-700">
              <FiUser /> {profile?.full_name || user.email}
            </span>
            <Link href="/dashboard" title="Dashboard" className="p-2 rounded hover:bg-gray-100">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="8" /><path d="M10 6v4l2 2" /></svg>
            </Link>
            {profile?.role === 'admin' && (
              <Link href="/settings" title="Configurações" className="p-2 rounded hover:bg-gray-100">
                <FiSettings />
              </Link>
            )}
            <button onClick={handleLogout} title="Sair" className="p-2 rounded hover:bg-gray-100 text-red-600">
              <FiLogOut />
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
