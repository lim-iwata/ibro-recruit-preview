# iBRO 採用LP ／ CSS 変更点 本番反映ガイド

宛先：内田さん／岩田さん  
作成：2026-05-19　LIM 岩田／MAIA  
対象：`recruit.ibro.jp` WP本番テーマ `LIM_responsive001` の CSS 更新

---

## 1. 何を変えるか・なぜ変えるか

### 修正点：`.photo-block` の高さ拡張

**変更前**：
```css
.photo-block {
  position: relative;
  width: 100%;
  height: clamp(220px, 38vh, 440px);
  overflow: hidden;
  margin: 0;
}
```

**変更後**：
```css
.photo-block {
  position: relative;
  width: 100%;
  height: clamp(320px, 55vh, 680px);
  overflow: hidden;
  margin: 0;
}
```

### 変更理由

岩田さんから2026-05-19に指摘：「DAILY MOMENTS / 千葉の暮らし」の photo-block で **手前の人物の上半身が画面外に切れて、何の画像か分からない** という問題。

`.photo-block` の元の高さ `clamp(220px, 38vh, 440px)` は、photo-block の表示エリアが幅100%（最大1920px）に対し高さ最大440px、つまり実効アスペクト比が **約4.36:1〜8.7:1（モバイル）の超横長** で、`background-size: cover` で配置される画像（多くは 16:9 = 1.78:1）の **上下 50%以上がトリミング** されて消えていた。

拡張後は `clamp(320px, 55vh, 680px)` となり、

| ビューポート | 旧高さ | 新高さ | 差分 |
|---|---|---|---|
| モバイル（375px幅） | 220px | 320px | +100px（+45%） |
| タブレット〜PC中間 | 38vh（約 380-440px） | 55vh（約 550-640px） | +約30〜45% |
| PC大画面 | 440px | 680px | +240px（+55%） |

これにより、人物の顔・上半身が画像中央に配置された素材であれば、ほぼ全身が見えるようになる。

### 副次効果と注意点

- HUMAN MADE モチーフの v3 仕様書「写真フルブリード比率↑」方針と整合
- スクロール量が若干増える（モバイル：1ページあたり photo-block 3個 → 約 +300px のスクロール）
- 同一ページ内の他の `photo-block` すべてに影響する（4ページ × 3〜4枚）
- `photo-block--tall` は影響なし（別途定義されている）

---

## 2. 本番反映手順（内田さん向け）

### 方法A：WP テーマファイル直接編集（推奨）

1. WP管理画面 → 外観 → テーマファイルエディター → `LIM_responsive001` テーマ
2. 編集対象：`assets/css/main.css`
3. 該当行を検索：`height: clamp(220px, 38vh, 440px);`（**通常1箇所のみ**、`.photo-block { ... }` 内）
4. 上記「変更後」コードに置換
5. 保存

または、FTP / GitHub 経由で `wp-content/themes/LIM_responsive001/assets/css/main.css` を直接編集。

### 方法B：チャイルドテーマでオーバーライド（影響範囲を絞りたい場合）

WPテーマ本体を触らずチャイルドテーマで上書き：

```css
/* チャイルドテーマの style.css または custom.css に追加 */
.photo-block {
  height: clamp(320px, 55vh, 680px) !important;
}
```

`!important` 必須（本体CSSより後に読まれることが前提）。

### 方法C：WP カスタマイザー → 追加CSS

WP管理画面 → 外観 → カスタマイズ → 追加CSS に上記「方法B」のコードを貼り付け。最も影響範囲が狭く、ロールバック容易。

---

## 3. CSS ファイル全体の場所

GitHub Pages preview（lim-iwata/ibro-recruit-preview）の該当ファイル：
```
recruit-site/assets/css/main.css   （行 1639-1645）
```

本番（recruit.ibro.jp）テーマでの該当パス（推定）：
```
wp-content/themes/LIM_responsive001/assets/css/main.css
```

---

## 4. 反映後の動作確認

| ページ | 確認カット | 確認内容 |
|---|---|---|
| highschool | `highschool_photo_03` (DAILY MOMENTS) | 画像内の人物の顔が見える |
| highschool | `highschool_photo_01` (ANOTHER ROUTE) | 道の上下が適度に見える |
| assistant | `assistant_photo_02` (SEIJINSHIKI) | 着付けの手元と着物全体が見える |
| stylist | `stylist_photo_03` (OUR TEAM) | 先輩の上半身が見える |
| eight | `eight_photo_02` (LONG RELATIONSHIPS) | 手元と髪の関係が見える |

すべて、修正前は被写体の上半身〜顔が切れていた。修正後はほぼ全体が見えるはず。

---

## 5. ロールバック手順

何か問題が起きた場合：
1. 方法A：「変更前」コードに戻す（1行）
2. 方法B/C：追加したCSSを削除

---

## 6. このCSS変更とあわせて行う他の作業

`HANDOFF_WP.md` 参照。具体的には：

- [ ] 4ページ（highschool/assistant/stylist/eight）の本実装版 HTML を WP に貼り付け（_wp-paste/ の4ファイル）
- [ ] 画像 17枚を `wp-content/themes/LIM_responsive001/assets/img/pixta/` にアップロード（recruit-site/assets/img/pixta/ から）
- [ ] TOP（index）と student ページの NUMBERS セクションコメントアウト確認（既に本番反映済）
- [ ] noindex メタタグ削除（公開直前）

---

ご不明点は LINE で岩田までお気軽に。よろしくお願いします。
