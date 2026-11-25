// AI 生活小幫手：同一個 Cloudflare Worker 提供網站與 AI 代理
// Secrets：ANTHROPIC_API_KEY（必填）、ACCESS_CODE（選填，設了同學要輸入存取碼）
// Vars：MODEL（預設 claude-sonnet-5-5）

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/api/chat') return chat(req, env);
    return env.ASSETS.fetch(req); // 其他路徑交給 public/ 的網站檔案
  },
};

async function chat(req, env) {
  const json = (obj, status) =>
    new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

  if (req.method !== 'POST') return json({ error: { message: '只接受 POST' } }, 405);
  if (!env.ANTHROPIC_API_KEY) return json({ error: { message: '伺服器尚未設定 ANTHROPIC_API_KEY' } }, 500);
  if (env.ACCESS_CODE && req.headers.get('x-access-code') !== env.ACCESS_CODE)
    return json({ error: { message: '需要存取碼', code: 'ACCESS_CODE' } }, 401);

  let body;
  try { body = await req.json(); } catch { return json({ error: { message: '請求格式錯誤' } }, 400); }
  if (!Array.isArray(body.messages) || !body.messages.length) return json({ error: { message: '缺少 messages' } }, 400);

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: env.MODEL || 'claude-sonnet-5-5',
      max_tokens: Math.min(Number(body.max_tokens) || 1500, 4000),
      system: String(body.system || '').slice(0, 10000),
      messages: body.messages.slice(-30), // 只保留最近 30 則，控制成本
      stream: true,
    }),
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') || 'text/event-stream', 'cache-control': 'no-cache' },
  });
}
