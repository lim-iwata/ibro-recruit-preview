# iBRO 採用LP ／ CSS 変更点 本番反映ガイド

宛先：内田さん／岩田さん  
作成：2026-05-19　LIM 岩田／MAIA  
対象：`recruit.ibro.jp` WP本番テーマ `LIM_responsive001` の CSS 更新

**今回の変更は3か所**：
- ① `.photo-block` の高さ拡張（1行）
- ② -A `.hero__bg::after` のグラデーションを空のトーンに変更（5行）
- ② -B `.hero__title` の text-shadow 強化（3行）

---

## 変更① ／ photo-block の高さ拡張

**対象ファイル**：`wp-content/themes/LIM_responsive001/assets/css/main.css`  
**行番号**：**1642 行目**

```css
/* 1639〜1645行目 .photo-block ブロック内 */

/* Before */
.photo-block {
  position: relative;
  width: 100%;
  height: clamp(220px, 38vh, 440px);   ← この1行を置換
  overflow: hidden;
  margin: 0;
}

/* After */
.photo-block {
  position: relative;
  width: 100%;
  height: clamp(320px, 55vh, 680px);   ← 新しい高さ
  overflow: hidden;
  margin: 0;
}
```

実質的に変わるのは **1行（`height:`）のみ** です。

### なぜ変えるか

岩田さん指摘（2026-05-19）：「DAILY MOMENTS / 千葉の暮らし」photo-block で、手前の人物の上半身が画面外に切れて何の画像か分からない。

`.photo-block` の高さが小さすぎ（モバイル220px・PC440px）て、`background-size: cover` で配置される 16:9 の画像の **上下50%以上がトリミング** されていたため。

拡張後の数値：

| ビューポート | 旧高さ | 新高さ | 差分 |
|---|---|---|---|
| モバイル（375px幅） | 220px | **320px** | +100px（+45%） |
| タブレット中盤（768px幅） | 約 290px | **約 422px** | +約45% |
| PC（1280px幅） | 約 440px | **約 640px** | +約45% |
| PC大画面（1920px幅以上） | 440px（上限） | **680px**（上限） | +240px |

### 影響範囲

全6ページの全 `.photo-block` 要素：

| ページ | 影響枚数 |
|---|---|
| TOP（page-id-6） | 3枚（IMAGE 01, 02, 03） |
| 美容学生（page-id-21） | 多数（PHOTO 01, 02, 03 ほか） |
| 高校生（公開時） | 3枚 |
| 中途アシスタント（公開時） | 3枚 |
| 中途スタイリスト（公開時） | 4枚 |
| 白髪染め専科 8（公開時） | 3枚 |

`.photo-block--tall`（SEIJINSHIKI など）は別定義のため**影響なし**。

---

## 変更② ／ ファーストビューのオーバーレイを「空の色」に変更

**対象ファイル**：`wp-content/themes/LIM_responsive001/assets/css/main.css`  
**行番号**：**328〜339 行目**（`.hero__bg::after` ブロック）＋ **352〜360 行目**（`.hero__title` のテキストシャドウ）

### ② -A ／ オーバーレイのグラデーション（328〜339行目）

```css
/* Before（現状・黒の半透明） */
.hero__bg::after {
  content: "";
  position: absolute; inset: 0;
  /* layered gradient: top dim for header readability, bottom heavily darker for sub readability */
  background:
    linear-gradient(180deg,
      rgba(0,0,0,0.55) 0%,
      rgba(0,0,0,0.18) 18%,
      rgba(0,0,0,0.22) 38%,
      rgba(0,0,0,0.55) 65%,
      rgba(0,0,0,0.85) 100%);
}

/* After（空のトーンに寄せた青系の半透明） */
.hero__bg::after {
  content: "";
  position: absolute; inset: 0;
  /* sky-toned gradient (no pure black): light sky tint up top, deepening to navy-sky at bottom for text contrast */
  background:
    linear-gradient(180deg,
      rgba(40, 85, 130, 0.30) 0%,
      rgba(150, 195, 220, 0.05) 14%,
      rgba(150, 195, 220, 0.05) 42%,
      rgba(20, 55, 95, 0.55) 70%,
      rgba(12, 35, 70, 0.85) 100%);
}
```

### ② -B ／ タイトルの text-shadow を軽量化（352〜359行目）

タイトル位置（vertical 60〜90%）はグラデーションの暗いゾーン（0.55〜0.85）の上に乗るため、シャドウは軽めで十分です。むしろ強すぎると黒の存在感が出てしまうので、ぼかしを大きくして影を薄くします。

```css
/* Before */
.hero__title {
  font-size: clamp(40px, 9vw, 96px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.015em;
  text-shadow:
    0 2px 4px rgba(0,0,0,0.45),
    0 4px 24px rgba(0,0,0,0.55);
}

/* After */
.hero__title {
  font-size: clamp(40px, 9vw, 96px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.015em;
  text-shadow:
    0 2px 6px rgba(0, 0, 0, 0.35),
    0 4px 18px rgba(0, 0, 0, 0.40);
}
```

サブコピー（`.hero__sub`）のシャドウは既に十分強いため変更不要です。

### なぜ変えるか

岩田さん指摘（2026-05-19）：TOP の FV（あなたが、長く続けられる場所を。）で、

1. 黒のオーバーレイが空を「汚し」、青空の魅力が消えている
2. 黒ではなく **「空の色に近い色」** で重ねたい
3. 同時に見出しの可読性は確保したい

| 位置 | 旧（黒系） | 新（空系） | 効果 |
|---|---|---|---|
| 最上部 0% | rgba(0,0,0,0.55) | **rgba(40, 85, 130, 0.30)** ディープスカイブルー | ヘッダーロゴ・JOBS ボタンの読みやすさを維持 |
| 上部 14〜42%（空） | rgba(0,0,0,0.18〜0.22) | **rgba(150, 195, 220, 0.05)** 薄いスカイブルー | **青空がそのまま、わずかに空色トーンで強調** |
| 中盤 70% | rgba(0,0,0,0.55) | **rgba(20, 55, 95, 0.55)** 深いスカイブルー | 黒ではなく「夕空」のような深みで暗化 |
| 最下部 100% | rgba(0,0,0,0.85) | **rgba(12, 35, 70, 0.85)** ネイビースカイ | サブコピー可読性キープ + 黒の濁りなし |

### 影響範囲

TOP ページ FV のみ（`.hero__bg::after` と `.hero__title`）。サブページの FV（`.ph-hero__bg::after` 1172行目）は **別定義のため影響なし**。

---

## 反映手順

### 方法A：WP管理画面 → 外観 → テーマファイルエディター

1. WP管理画面 → 外観 → テーマファイルエディター
2. テーマ：`LIM_responsive001`
3. 右側ファイル一覧から `assets/css/main.css`
4. **変更① 1642行目** を検索（`height: clamp(220px, 38vh, 440px);`）→ 置換
5. **変更② -A 328〜339行目** の `.hero__bg::after` ブロックを丸ごと置換（上記 After をコピペ）
6. **変更② -B 352〜360行目** の `.hero__title` の `text-shadow` 部分を置換
7. 「ファイルを更新」

### 方法B：FTP / SFTP 経由

`wp-content/themes/LIM_responsive001/assets/css/main.css` を取得して、ローカルで3か所編集して再アップロード。

---

## 反映後の動作確認

| ページ | 確認カット | 確認内容 |
|---|---|---|
| TOP | FV「あなたが、長く続けられる場所を。」 | **青空がはっきり水色に見える／タイトル白文字は依然読める／サブコピーも読める** |
| TOP | IMAGE 01「店舗外観カット」 | 上下の余白が拡張、メインの被写体が中央に |
| TOP | IMAGE 02「アカデミー風景」 | 同上 |
| 美容学生 | CHAPTER 02 PHOTO 01「もうひとつの道」 | 道の遠近感が見える |
| 美容学生 | CHAPTER 11 PHOTO 03「DAILY MOMENTS / 千葉の暮らし」 | **修正前は人物の上半身が切れていた → 修正後は顔が見える** |

スマホ・PC 両方で確認をお願いします（特に TOP FV の青空とサブコピー可読性）。

---

## ロールバック手順

問題があれば、上記 Before の数値に戻すだけ。

- 変更① ：`height: clamp(220px, 38vh, 440px);`
- 変更② -A：5つの rgba を `rgba(0,0,0,0.55) / rgba(0,0,0,0.18) / rgba(0,0,0,0.22) / rgba(0,0,0,0.55) / rgba(0,0,0,0.85)` に戻す
- 変更② -B：`text-shadow: 0 2px 4px rgba(0,0,0,0.45), 0 4px 24px rgba(0,0,0,0.55);` に戻す（旧値）

---

## 同時に行う他の作業

`HANDOFF_WP.md` 参照：

- [ ] 4ページ（highschool/assistant/stylist/eight）の本実装版 HTML を WP に貼り付け（_wp-paste/ の4ファイル）
- [ ] 画像 17枚を `wp-content/themes/LIM_responsive001/assets/img/pixta/` にアップロード（recruit-site/assets/img/pixta/ から）
- [ ] noindex メタタグ削除（公開直前）

---

ご不明点は LINE で岩田までお気軽に。よろしくお願いします。
