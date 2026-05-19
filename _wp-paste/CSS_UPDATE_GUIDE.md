# iBRO 採用LP ／ CSS 変更点 本番反映ガイド

宛先：内田さん／岩田さん  
作成：2026-05-19　LIM 岩田／MAIA  
対象：`recruit.ibro.jp` WP本番テーマ `LIM_responsive001` の CSS 更新

---

## 1. 変更内容（1行のみ）

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

---

## 2. なぜ変えるか

岩田さん指摘（2026-05-19）：「DAILY MOMENTS / 千葉の暮らし」photo-block で、手前の人物の上半身が画面外に切れて何の画像か分からない。

`.photo-block` の高さが小さすぎ（モバイル220px・PC440px）て、`background-size: cover` で配置される 16:9 の画像の **上下50%以上がトリミング** されていたため。

拡張後の数値：

| ビューポート | 旧高さ | 新高さ | 差分 |
|---|---|---|---|
| モバイル（375px幅） | 220px | **320px** | +100px（+45%） |
| タブレット中盤（768px幅） | 約 290px | **約 422px** | +約45% |
| PC（1280px幅） | 約 440px | **約 640px** | +約45% |
| PC大画面（1920px幅以上） | 440px（上限） | **680px**（上限） | +240px |

---

## 3. 影響範囲

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

## 4. 反映手順

### 方法A：WP管理画面 → 外観 → テーマファイルエディター

1. WP管理画面 → 外観 → テーマファイルエディター
2. テーマ：`LIM_responsive001`
3. 右側ファイル一覧から `assets/css/main.css`
4. **1642行目** を検索（`height: clamp(220px, 38vh, 440px);`）
5. `height: clamp(320px, 55vh, 680px);` に置換
6. 「ファイルを更新」

### 方法B：FTP / SFTP 経由

`wp-content/themes/LIM_responsive001/assets/css/main.css` を取得して、ローカルで 1642 行目を編集して再アップロード。

---

## 5. 反映後の動作確認

| ページ | 確認カット | 確認内容 |
|---|---|---|
| TOP | IMAGE 01「店舗外観カット」 | 上下の余白が拡張、メインの被写体が中央に |
| TOP | IMAGE 02「アカデミー風景」 | 同上 |
| 美容学生 | CHAPTER 02 PHOTO 01「もうひとつの道」 | 道の遠近感が見える |
| 美容学生 | CHAPTER 11 PHOTO 03「DAILY MOMENTS / 千葉の暮らし」 | **修正前は人物の上半身が切れていた → 修正後は顔が見える** |

---

## 6. ロールバック手順

問題があれば、1642行目を元の値に戻すだけ：

```css
height: clamp(220px, 38vh, 440px);   /* 元に戻す */
```

---

## 7. 同時に行う他の作業

`HANDOFF_WP.md` 参照：

- [ ] 4ページ（highschool/assistant/stylist/eight）の本実装版 HTML を WP に貼り付け（_wp-paste/ の4ファイル）
- [ ] 画像 17枚を `wp-content/themes/LIM_responsive001/assets/img/pixta/` にアップロード（recruit-site/assets/img/pixta/ から）
- [ ] noindex メタタグ削除（公開直前）

---

ご不明点は LINE で岩田までお気軽に。よろしくお願いします。
