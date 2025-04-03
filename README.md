# テックブログ

Next.js、microCMS、Vercel、Google AdSenseを使用したテック系ブログプラットフォームです。

## 機能

- **Next.js App Router**: 最新のNext.jsアーキテクチャを使用
- **microCMS**: ヘッドレスCMSによるコンテンツ管理
- **Tailwind CSS**: モダンなUIデザイン
- **Google AdSense**: 広告収益化
- **Vercel**: 高速なホスティングとデプロイ

## 環境変数の設定

プロジェクトのルートに`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```
MICROCMS_API_KEY=your_api_key
MICROCMS_SERVICE_DOMAIN=your_service_domain
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id
```

## 開発環境の起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

[http://localhost:3000](http://localhost:3000)をブラウザで開いて結果を確認できます。

## microCMSの設定

1. [microCMS](https://microcms.io/)でアカウントを作成
2. 以下のAPIを作成：
   - `blogs`: ブログ記事用API
   - `categories`: カテゴリー用API
   - `tags`: タグ用API

### ブログAPIのフィールド構成

- `title`: タイトル（テキストフィールド）
- `content`: 本文（リッチエディタ）
- `eyecatch`: アイキャッチ画像（画像フィールド）
- `category`: カテゴリー（コンテンツ参照 - categories）
- `tags`: タグ（複数コンテンツ参照 - tags）

## Vercelへのデプロイ

1. [Vercel](https://vercel.com/)でアカウントを作成
2. GitHubリポジトリと連携
3. 環境変数を設定：
   - `MICROCMS_API_KEY`
   - `MICROCMS_SERVICE_DOMAIN`
   - `NEXT_PUBLIC_GOOGLE_ADSENSE_ID`
4. デプロイを実行

## Google AdSenseの設定

1. [Google AdSense](https://www.google.com/adsense/)でアカウントを作成
2. サイトを登録して審査を受ける
3. 承認後、発行されたIDを`NEXT_PUBLIC_GOOGLE_ADSENSE_ID`環境変数に設定

## ライセンス

