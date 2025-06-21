// web/src/components/AuthForm.js
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { createOrUpdateProfile } from '../utils/createOrUpdateProfile';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Cria perfil após cadastro
    if (data.user) {
      await createOrUpdateProfile(data.user, {
        full_name: fullName,
        birth_date: birthDate,
        phone: phone
      });
    }
    setSuccess('Verifique seu e-mail para confirmar o cadastro.');
    setLoading(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Atualiza perfil após login
    if (data.user) {
      await createOrUpdateProfile(data.user, {
        full_name: fullName,
        birth_date: birthDate,
        phone: phone
      });
    }
    setSuccess('Login realizado com sucesso!');
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Login / Cadastro</h2>
      <form>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Nome completo (opcional)"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="date"
          placeholder="Data de nascimento (opcional)"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Telefone (opcional)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button onClick={handleSignIn} disabled={loading} style={{ width: '49%', marginRight: '2%' }}>
          Entrar
        </button>
        <button onClick={handleSignUp} disabled={loading} style={{ width: '49%' }}>
          Cadastrar
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
