const fs   = require('fs');
const path = require('path');

const IMAGE_EXTS = /\.(jpg|jpeg|png|webp|gif|avif)$/i;

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');

  const dir = path.join(process.cwd(), 'photos');

  // meta.json（任意）からキャプション読み込み
  let meta = {};
  try {
    meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
  } catch {}

  // 画像ファイル一覧を取得
  let photos = [];
  try {
    photos = fs.readdirSync(dir)
      .filter(f => IMAGE_EXTS.test(f))
      .sort()
      .map(f => ({
        src:  `/photos/${f}`,
        name: meta[f]?.name || '',
        text: meta[f]?.text || '',
      }));
  } catch {}

  res.json(photos);
};
