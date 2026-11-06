// Configuration publique Supabase. Remplacez ces deux valeurs après avoir créé le projet.
window.CMCB_SUPABASE = {
  url: 'https://VOTRE-PROJET.supabase.co',
  anonKey: 'VOTRE_CLE_ANON_PUBLIQUE'
};
window.cmcbApi = async function(path, options = {}) {
  const config = window.CMCB_SUPABASE;
  if (config.url.includes('VOTRE-PROJET')) throw new Error('Supabase n’est pas encore configuré.');
  const token = localStorage.getItem('cmcb_admin_token') || config.anonKey;
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {'apikey': config.anonKey, 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json', 'Prefer':'return=representation', ...(options.headers||{})}
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Une erreur est survenue.');
  return response.status === 204 ? null : response.json();
};
