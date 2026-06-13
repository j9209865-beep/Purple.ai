export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { action, email, password } = req.body;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  try {
    let url, body;

    if (action === 'signup') {
      url = `${SUPABASE_URL}/auth/v1/signup`;
      body = { email, password };
    } else {
      url = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
      body = { email, password };
    }

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    return res.status(200).json(data);

  } catch(e) {
    return res.status(500).json({ error: 'Erreur serveur', details: e.message });
  }
}
