// Cloudflare Worker：AI 生活小幫手的 API 代理
// 環境變數（Settings → Variables and Secrets）：
//   ANTHROPIC_API_KEY  (Secret，必填)  你的 Claude API Key
//   ACCESS_CODE        (Secret，選填)  設了之後 App 要填同一組存取碼才能用
//   MODEL              (選填)          預設 claude-sonnet-5-5；想省錢可改 claude-haiku-5-5
//   ALLOW_ORIGIN       (選填)          限制只有你的網站能呼叫，例如 https://ai-helper.pages.dev

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type, x-access-code',
    };
    const json = (obj, status) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, 'content-type': 'application/json; charset=utf-8' } });

    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return json({ error: { message: '只接受 POST' } }, 405);
    if (!env.ANTHROPIC_API_KEY) return json({ error: { message: 'Worker 尚未設定 ANTHROPIC_API_KEY' } }, 500);
    if (env.ACCESS_CODE && req.headers.get('x-access-code') !== env.ACCESS_CODE)
      return json({ error: { message: '存取碼錯誤' } }, 401);

    let body;
    try { body = await req.json(); } catch { return json({ error: { message: '請求格式錯誤' } }, 400); }
    if (!Array.isArray(body.messages) || !body.messages.length)
      return json({ error: { message: '缺少 messages' } }, 400);

    const payload = {
      model: env.MODEL || 'claude-sonnet-5-5',
      max_tokens: Math.min(Number(body.max_tokens) || 1500, 4000),
      system: String(body.system || '').slice(0, 10000),
      messages: body.messages.slice(-30), // 只保留最近 30 則，控制成本
      stream: true,
    };

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...cors,
        'content-type': upstream.headers.get('content-type') || 'text/event-stream',
        'cache-control': 'no-cache',
      },
    });
  },
};
