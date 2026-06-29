/**
 * ゼニくる: 新着の応援（エール）を自動で X に投稿する Vercel Cron 関数
 *
 * 方式A（ポーリング）:
 *   - live-donations API を定期取得し、前回投稿以降の新着だけを X に投稿する
 *   - 支援者名（supporterLabel）は投稿しない（プロジェクト名と金額のみ）
 *   - 重複防止に「最後に投稿した donation id」を Upstash Redis(KV) に保存
 *
 * 必要な環境変数:
 *   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET  … X API v2 投稿用
 *   KV_REST_API_URL, KV_REST_API_TOKEN                        … 状態保存（任意・推奨）
 *   CRON_SECRET                                               … Cron以外からの実行を拒否（任意・推奨）
 */

const crypto = require('crypto');

const API = 'https://api.zenicle.jp';
const APP_URL = 'https://app.zenicle.jp';
const FETCH_LIMIT = 100;         // 1回の取得件数（APIの上限。日次の新着を取りこぼさない）
const MAX_POSTS_PER_RUN = 100;   // 安全上限のみ。通常は新着を全件投稿する（繰り越しは基本発生しない）
const CURSOR_KEY = 'zenicle:last_posted_donation_id';
const WINDOW_HOURS = 24;         // KV未設定時のみ使用。日次Cronの実行間隔に合わせる

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

module.exports = async (req, res) => {
  // Cron以外からの実行を拒否（CRON_SECRET 設定時のみ）
  if (process.env.CRON_SECRET) {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  }

  try {
    const xCreds = getXCreds();
    if (!xCreds) {
      return res.status(500).json({ error: 'X API credentials are not configured' });
    }

    // 1. 新着取得（createdAt 降順で返る）
    const json = await fetchJson(`${API}/public/live-donations?limit=${FETCH_LIMIT}`);
    const items = json?.data?.items || [];
    if (items.length === 0) {
      return res.status(200).json({ posted: 0, reason: 'no items' });
    }

    const kvEnabled = !!(KV_URL && KV_TOKEN);
    let fresh;          // 投稿対象（新しい順）
    let lastId = null;  // KVモードのみ使用

    if (kvEnabled) {
      // === カーソル方式（KVあり・堅牢）===
      lastId = await kvGet(CURSOR_KEY);
      // 初回はバックログ一斉投稿を避け、最新IDだけ記録して終了
      if (!lastId) {
        await kvSet(CURSOR_KEY, items[0].id);
        return res.status(200).json({ posted: 0, reason: 'initialized cursor', cursor: items[0].id });
      }
      fresh = [];
      for (const it of items) {
        if (it.id === lastId) break;
        fresh.push(it);
      }
    } else {
      // === 時間ウィンドウ方式（KVなし・状態保存不要）===
      // 直近 WINDOW_HOURS 時間に発生した応援のみ投稿。日次Cronと等間隔のため通常は重複/抜けなし
      const since = Date.now() - WINDOW_HOURS * 60 * 60 * 1000;
      fresh = items.filter((it) => {
        const t = Date.parse(it.createdAt);
        return Number.isFinite(t) && t >= since;
      });
    }

    if (!fresh || fresh.length === 0) {
      return res.status(200).json({ posted: 0, reason: 'no new cheers' });
    }

    // 古い順に投稿（安全上限あり）
    const toPost = fresh.reverse().slice(0, MAX_POSTS_PER_RUN);
    const results = [];
    let newestPostedId = lastId;
    for (const it of toPost) {
      const text = buildTweet(it);
      const r = await postTweet(text, xCreds);
      results.push({ id: it.id, ok: r.ok, status: r.status });
      if (!r.ok) break;           // 失敗したらそこで止める（次回再試行）
      newestPostedId = it.id;
    }

    // カーソル更新（KVモードのみ・投稿成功した分まで）
    if (kvEnabled && newestPostedId && newestPostedId !== lastId) {
      await kvSet(CURSOR_KEY, newestPostedId);
    }

    return res.status(200).json({
      mode: kvEnabled ? 'cursor' : 'time-window',
      posted: results.filter(r => r.ok).length,
      skipped: fresh.length - toPost.length,
      results,
    });
  } catch (err) {
    console.error('[post-cheers] error:', err);
    return res.status(500).json({ error: String(err && err.message || err) });
  }
};

// ---- 投稿文の組み立て（支援者名は含めない） ----
function buildTweet(it) {
  const amount = Number(it.amount || 0).toLocaleString('ja-JP');
  let team = (it.teamName || 'プロジェクト').trim();
  // 全体で280字に収めるためチーム名を安全側で短縮
  if (team.length > 60) team = team.slice(0, 59) + '…';
  // 注意: 投稿にURLを含めると X API 課金が $0.015→$0.20/件（約13倍）になるため、URLは入れない
  return [
    '🎉 新しい応援が届きました！',
    '',
    `📍 ${team}`,
    `💰 ${amount}円のエール`,
    '',
    '#ゼニくる #応援',
  ].join('\n');
}

// ---- X API v2: POST /2/tweets（OAuth1.0a） ----
function getXCreds() {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_SECRET;
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) return null;
  return { apiKey, apiSecret, accessToken, accessSecret };
}

async function postTweet(text, creds) {
  const url = 'https://api.twitter.com/2/tweets';
  const authHeader = buildOAuthHeader('POST', url, creds);
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    console.error('[post-cheers] X API error', resp.status, body);
  }
  return { ok: resp.ok, status: resp.status };
}

function buildOAuthHeader(method, url, creds) {
  const oauth = {
    oauth_consumer_key: creds.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: creds.accessToken,
    oauth_version: '1.0',
  };
  // JSONボディのPOSTでは、署名ベースに含めるのは oauth_* パラメータのみ
  const paramString = Object.keys(oauth)
    .sort()
    .map((k) => `${enc(k)}=${enc(oauth[k])}`)
    .join('&');
  const baseString = [method.toUpperCase(), enc(url), enc(paramString)].join('&');
  const signingKey = `${enc(creds.apiSecret)}&${enc(creds.accessSecret)}`;
  oauth.oauth_signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64');
  return (
    'OAuth ' +
    Object.keys(oauth)
      .sort()
      .map((k) => `${enc(k)}="${enc(oauth[k])}"`)
      .join(', ')
  );
}

// RFC3986 準拠のエンコード
function enc(s) {
  return encodeURIComponent(String(s)).replace(
    /[!*'()]/g,
    (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

// ---- 共通 ----
async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch failed ${r.status} ${url}`);
  return r.json();
}

// ---- 状態保存: Upstash Redis(KV) REST。未設定なら no-op ----
async function kvGet(key) {
  if (!KV_URL || !KV_TOKEN) return null;
  const r = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!r.ok) return null;
  const j = await r.json().catch(() => ({}));
  return j.result || null;
}

async function kvSet(key, value) {
  if (!KV_URL || !KV_TOKEN) return false;
  const r = await fetch(
    `${KV_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`,
    { headers: { Authorization: `Bearer ${KV_TOKEN}` } }
  );
  return r.ok;
}
