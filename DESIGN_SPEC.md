# ゼニくる デザイン仕様書
> LP（zenicle-lp）のトーン&マナーをサービスサイトに引き継ぐための設計仕様。

---

## 1. デザインコンセプト

| 項目 | 内容 |
|---|---|
| **キーワード** | バトル / アニメ / エンタメ / 夜の渋谷 / お金の解放 |
| **トーン** | 熱狂的・挑戦的・エネルギッシュ。しかし品は保つ |
| **NG** | 清潔感重視のライトSaaS / 柔らかいパステル / 丸みすぎるUI |

---

## 2. カラーパレット

### Primary — Gold（行動・強調・お金）
| Token | HEX | 用途 |
|---|---|---|
| `gold` | `#f59e0b` | ボタン・アイコン・アクセント |
| `gold-light` | `#fbbf24` | グラデーション明端・タグ |
| `gold-dark` | `#d97706` | ホバー・グラデーション暗端 |

### Secondary — Purple（テック・未来・Web3）
| Token | HEX | 用途 |
|---|---|---|
| `purple` | `#7c3aed` | アバター・アクセント |
| `purple-light` | `#a78bfa` | サブラベル・タグ文字 |

### Background（ダーク系）
| Token | HEX / rgba | 用途 |
|---|---|---|
| `bg-base` | `#0a0812` | ページ背景・メイン |
| `bg-section-alt` | `#0d0b1c` | 交互セクション背景 |
| `bg-card` | `rgba(15,12,30,.92)` | カード背景 |
| `bg-overlay-dark` | `rgba(8,6,16,.96)` | スクロール後ナビ背景 |

### アクセントカラー（カード上部ボーダー用）
| 用途 | HEX |
|---|---|
| 課題①（方向性） | `rgba(124,58,237,.7)` = purple |
| 課題②（アイデア） | `rgba(245,158,11,.7)` = gold |
| 課題③（資金） | `rgba(239,68,68,.7)` = red |
| 挑戦者バッジ 高校生 | `#ef4444`→`#f87171` グラデ |

---

## 3. タイポグラフィ

### フォント
- **フォントファミリー**: `'Noto Sans JP', sans-serif`（Google Fonts）
- **読み込みウェイト**: 400 / 500 / 700 / 900

### テキストスケール
| 用途 | サイズ | ウェイト |
|---|---|---|
| ページ最大見出し | `text-5xl`（3rem） | 900 |
| セクション見出し | `text-3xl`〜`text-4xl` | 900 |
| カード見出し | `text-base`（1rem） | 700 |
| 本文 | `text-sm`〜`text-base` | 400〜500 |
| ラベル（英語） | `0.68rem` | 700 |
| タグ・バッジ | `text-xs` | 600 |

### ゴールドグラデーションテキスト
```css
.gold-text {
  background: linear-gradient(135deg, #f59e0b, #fbbf24, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### セクションラベル（ABOUT / FEATURES 等）
```css
.s-label {
  font-size: .68rem;
  font-weight: 700;
  letter-spacing: .2em;
  color: #f59e0b;
  text-transform: uppercase;
  /* 両端に細いゴールドの横線 */
}
```

---

## 4. コンポーネント

### ダークカード（dark-card）
```css
background: rgba(15,12,30,.92);
border: 1px solid rgba(245,158,11,.18);
border-radius: 1.25rem;  /* 20px */

/* Hover */
transform: translateY(-4px);
border-color: rgba(245,158,11,.42);
box-shadow: 0 0 30px rgba(245,158,11,.12), 0 20px 48px rgba(0,0,0,.5);
transition: .3s ease;
```

### プライマリボタン（ゴールド）
```css
background: linear-gradient(135deg, #f59e0b, #fbbf24);
color: #0a0812;
font-weight: 900;
border-radius: 9999px;  /* pill */
padding: 1.25rem 3.5rem;
box-shadow: 0 12px 50px rgba(245,158,11,.45);

/* Hover */
transform: scale(1.05);
```

### セカンダリボタン（アウトライン）
```css
background: transparent;
border: 1px solid rgba(245,158,11,.3);
color: #f59e0b;
border-radius: 9999px;
```

### タグ（ゴールド系）
```css
background: rgba(245,158,11,.1);
border: 1px solid rgba(245,158,11,.25);
color: #f59e0b;
font-size: .75rem;
font-weight: 600;
border-radius: 9999px;
padding: .25rem .75rem;
```

### タグ（パープル系）
```css
background: rgba(167,139,250,.1);
border: 1px solid rgba(167,139,250,.25);
color: #a78bfa;
/* その他は共通 */
```

### アイコンボックス（feat-icon）
```css
width: 3rem; height: 3rem;
border-radius: .875rem;  /* 14px */
background: rgba(245,158,11,.1);
border: 1px solid rgba(245,158,11,.22);
```

### セクション区切り線（gold-divider）
```css
height: 1px;
background: linear-gradient(to right, transparent, rgba(245,158,11,.4), transparent);
```

### ランキングバッジ
```css
/* 1位 */  background: linear-gradient(135deg, #fbbf24, #f59e0b);
/* 2位 */  background: linear-gradient(135deg, #d1d5db, #9ca3af);
/* 3位 */  background: linear-gradient(135deg, #d97706, #92400e);
```

---

## 5. スペーシング・レイアウト

| 用途 | 値 |
|---|---|
| セクション縦padding | `py-24`（6rem） |
| コンテナ最大幅 | `max-w-6xl`（72rem） / `max-w-5xl` / `max-w-4xl` |
| コンテナ横padding | `px-5`（1.25rem） |
| カードgap | `gap-5`（1.25rem） |
| カード内padding | `p-7`〜`p-8` |

---

## 6. アニメーション

| 名前 | 用途 | 時間 |
|---|---|---|
| `fadeInUp` | ヒーロー要素の初期表示 | 0.7s |
| `reveal` | スクロール連動フェードイン | 0.6s |
| `borderGlow` | カードのゴールド発光ループ | 3s |
| `scanLine` | セクション横断する光のライン | 5s |
| `pulseDot` | ライブインジケーター点滅 | 1.5s |
| `coinRise` | ¥ が下から舞い上がる | 5〜11s |
| `coinFromLeft/Right/Top` | ¥ が四方から飛来 | 1.8〜4s |
| `coinFromCursor` | マウス追従 ¥ エフェクト | 0.9〜2s |

### スクロール reveal の使い方
```html
<!-- 要素に .reveal クラスを付けるだけで IntersectionObserver が自動適用 -->
<div class="reveal">...</div>
<!-- 遅延させる場合 -->
<div class="reveal" style="transition-delay:.1s">...</div>
```

---

## 7. ナビゲーション

```
[ゼニくる（ゴールド）]  [ゼニくるとは] [機能] [使い方] [FAQ]  [今すぐ始める（ゴールドボタン）]
```

- 透明背景 → スクロールで `rgba(8,6,16,.96)` に変化
- ボトムボーダー: `rgba(245,158,11,.08)`
- `position: fixed; z-index: 50`

---

## 8. テキストカラー一覧

| 用途 | 値 |
|---|---|
| メイン本文 | `#f1f5f9` |
| サブテキスト | `rgba(255,255,255,.6)` |
| 薄いサブテキスト | `rgba(255,255,255,.4)〜.5` |
| 極薄（補足） | `rgba(255,255,255,.28)〜.35` |
| ゴールドアクセント | `#f59e0b` / `#fbbf24` |
| パープルアクセント | `#a78bfa` |

---

## 9. 背景パターン

### ラジアルグロー（セクション装飾）
```css
/* ゴールド系 */
background: radial-gradient(ellipse at 50% 0%,
  rgba(245,158,11,.05) 0%, transparent 60%);

/* パープル系 */
background: radial-gradient(ellipse,
  rgba(124,58,237,.14) 0%, transparent 70%);
```

### scan-wrap（動的光ライン）
```css
/* .scan-wrap クラスを持つセクションに自動適用 */
/* ゴールドの細い光が左→右へ流れる */
```

---

## 10. レスポンシブ方針

| ブレークポイント | 対応 |
|---|---|
| `md`（768px+） | 2カラムグリッド・フルナビ |
| `< 768px` | 1カラム・ハンバーガーなし（ナビはスマホ非表示） |

### ヒーローセクション（スマホ特有）
- `height: 75vw`（画像アスペクト比 4:3 に合わせる）
- `margin-top: 3.5rem`（固定ヘッダーと重なりを回避）
- `background-size: 100% auto; background-position: top center`

---

## 11. For CHALLENGERS セクション 事例表示

挑戦者バッジの色分け:
| 属性 | グラデーション |
|---|---|
| 高校生 | `#f87171` → `#ef4444` |
| 20代 | `#f59e0b` → `#d97706` |
| 30代 | `#7c3aed` → `#a78bfa` |
| 40代 | `#6d28d9` → `#7c3aed` |

---

## 12. 実装チェックリスト（サービスサイト移行時）

- [ ] Noto Sans JP（400/500/700/900）を Google Fonts から読み込む
- [ ] CSS変数でカラートークンを定義する
- [ ] ページ背景色を `#0a0812` に設定する
- [ ] `gold-text` グラデーションクラスを用意する
- [ ] `dark-card` スタイルをコンポーネント化する
- [ ] プライマリボタン（ゴールドグラデーション・pill・黒文字）を共通化する
- [ ] セクションラベル（英語大文字 + 横線）コンポーネントを作る
- [ ] スクロール reveal アニメーションを実装する
- [ ] `gold-divider` セクション区切りを使う
- [ ] ¥パーティクルアニメーションは任意（エンタメ性が必要なページに）
- [ ] マウス追従 ¥ エフェクトは任意

---

*最終更新: zenicle-lp v1.0 より抽出*
