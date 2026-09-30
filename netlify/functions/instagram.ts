import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Credentials and private metrics stay on the server. Reuse management sessions.
const ACCOUNT = '17841465116023662';
const ORIGIN = 'https://nahueldenardo-991.github.io';
const headers = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

export default async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'GET') return json({ error: 'Método no permitido.' }, 405);
  const sessionToken = request.headers.get('Authorization')?.match(/^Bearer ([A-Za-z0-9._-]{1,512})$/)?.[1];
  if (!sessionToken) return json({ error: 'Ingresá con la clave de gestión.' }, 401);
  try {
    const sessions = getStore({ name: 'bruner-settings', consistency: 'strong' });
    const session = await sessions.get('management-sessions/' + sessionToken, { type: 'json' }) as { expiresAt?: number } | null;
    if (!session || Number(session.expiresAt) <= Date.now() || !Number.isFinite(session.expiresAt))
      return json({ error: 'La sesión venció. Volvé a ingresar.' }, 401);
    const accessToken = process.env.BRUNER_INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken) return json({ error: 'La conexión de Instagram todavía no está configurada.' }, 503);
    const graph = async (path: string, params: Record<string, string> = {}) => {
      const url = new URL('https://graph.instagram.com/v25.0/' + path);
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
      const response = await fetch(url, {
        headers: { Authorization: 'Bearer ' + accessToken },
        signal: AbortSignal.timeout(15000),
      });
      const body = await response.json();
      if (!response.ok || body.error) throw new Error('Instagram no permitió la consulta. Revisá la vigencia y los permisos de la conexión.');
      return body;
    };
    // Verify the identity before returning any account data.
    const profile = await graph(ACCOUNT, { fields: 'id,username,followers_count' });
    if (profile.username !== 'bruner.instituto') return json({ error: 'La conexión no corresponde a Bruner.' }, 502);
    const until = Math.floor(Date.now() / 1000), since = until - 30 * 86400;
    const metrics = await graph(ACCOUNT + '/insights', {
      metric: 'views,reach,total_interactions,accounts_engaged',
      period: 'day', metric_type: 'total_value', since: String(since), until: String(until),
    });
    const media = await graph(ACCOUNT + '/media', {
      fields: 'id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count', limit: '50',
    });
    const recent = (media.data || []).filter((p: { timestamp: string }) => Date.parse(p.timestamp) >= since * 1000);
    const posts = recent.map((p: Record<string, unknown>) => ({
      id: p.id, text: p.caption || '', url: p.permalink, publishedAt: p.timestamp,
      format: p.media_product_type || p.media_type, likes: p.like_count ?? null, comments: p.comments_count ?? null,
    }));
    const value = (name: string) => {
      const n = metrics.data?.find((m: { name: string }) => m.name === name)?.total_value?.value;
      return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : null;
    };
    return json({
      ok: true, account: profile.username, checkedAt: new Date().toISOString(),
      since: new Date(since * 1000).toISOString(), until: new Date(until * 1000).toISOString(),
      posts, postsComplete: !media.paging?.next || (media.data?.length > 0 && Date.parse(media.data.at(-1).timestamp) < since * 1000),
      metrics: { views: value('views'), reach: value('reach'), interactions: value('total_interactions'),
        engagedAccounts: value('accounts_engaged'), followers: profile.followers_count ?? null },
    });
  } catch {
    // Never return upstream error bodies: they may include request credentials.
    return json({ error: 'No se pudieron consultar los insights. La conexión necesita verificación.' }, 502);
  }
};

export const config: Config = { path: '/api/instagram' };
