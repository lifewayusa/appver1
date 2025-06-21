// web/src/utils/createOrUpdateProfile.js
import { supabase } from '../supabaseClient';

/**
 * Cria ou atualiza o perfil do usuário na tabela profiles após cadastro/login.
 * @param {Object} user - Objeto user retornado pelo Supabase Auth
 * @param {Object} [profileData] - Campos opcionais do perfil (full_name, birth_date, phone)
 */
export async function createOrUpdateProfile(user, profileData = {}) {
  if (!user) return;
  const { id, email } = user;
  // Verifica se já existe profile
  const { data: existing, error: fetchError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // erro diferente de not found
    throw fetchError;
  }

  const profile = {
    user_id: id,
    email,
    ...profileData,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    // Atualiza
    return await supabase.from('profiles').update(profile).eq('user_id', id);
  } else {
    // Cria
    profile.created_at = new Date().toISOString();
    return await supabase.from('profiles').insert([profile]);
  }
}
