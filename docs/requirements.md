# システムの目的・背景
ラーメンブログアプリ。

## 技術スタック
- **フロントエンド**: Next.js, TypeScript, Tailwind CSS, shadcn/ui, Tiptap
- **バックエンド**: Go
- **データベース**: MySQL
- **インフラ**: 検討中（Vercel, AWS）, Docker
- **その他**: Git, Swagger UI

## 全体構成図
- システム全体像（アーキテクチャ概要図）

## 機能要件
1. **認証機能**
    - メールアドレス・パスワードでの新規登録、ログイン
    - ログアウト
2. **記事投稿機能**
    - 記事の作成（Notionライクなテキスト入力。画像投稿も可能。）
    - 記事の投稿
    - 記事の編集
    - 記事の削除
    - 記事の下書き保存
3. **記事表示機能**
    - 記事一覧表示
    - 記事詳細表示
    - いいね機能
    - 記事の保存
4. **ユーザー機能**
    - いいね
    - プロフィール表示
    - プロフィール編集
    - コメント
    - ランキング表示（週間、月間、年間）

## 非機能要件
1. **セキュリティ**
    - ユーザー認証として、JWT認証を採用する。
    - パスワードはハッシュ化して保存する。平文で保存しないこと。
    - CookieのSameSite:Noneで運用する場合は、CSRF対策を必ず行うこと。
    - database/sqlを使用する場合は、SQLインジェクション対策で、ローSQLを避け、プリペアドステートメントを使用すること。必要に応じでORMを導入すること。
2. **ユーザビリティ**
    - レスポンシブデザイン対応
    - シンプルで使いやすいデザイン

## 画面構成
- ホーム画面（記事一覧表示）
- 記事詳細画面（記事の内容表示）
- ログイン・新規登録画面
- プロフィール画面
- ランキング画面（記事のランキングを表示）

## データベース設計
作成中...

## API設計
./openapi.yaml参照

## 認証設計

### アーキテクチャ
- **BFF（Backend for Frontend）** + **Supabase認証**を採用
- Next.js Route Handler（BFF層）でSupabase認証を処理
- JWT認証をHttpOnly Cookieで管理（Supabase SSR）

### 認証フロー
1. **クライアント**: フロントエンドから`/api/auth/*`（Route Handler）を呼び出し
2. **BFF層**: Route HandlerでSupabase認証API（`signInWithPassword`, `signUp`, `signOut`）を実行
3. **セッション管理**: SupabaseがHttpOnly CookieにJWT（access-token, refresh-token）を自動保存
4. **認証状態**: Client Components・Server Components両方でセッション情報にアクセス可能

### JWT管理
- **保存場所**: HttpOnly Cookie（Supabaseが自動管理）
- **アクセス方法**:
  - Client Components: ブラウザが自動でCookieを送信（`credentials: 'include'`）
  - Server Components: `createServerSideClient()`でCookieから取得
- **Go API連携**: Server ComponentからJWTを取得し、`Authorization: Bearer <token>`ヘッダーで送信

#### Cookieの設定（Supabaseが自動設定）
- HttpOnly属性: true
- Secure属性: false（開発時）、true（本番環境）
- SameSite属性: Supabaseの設定に従う
- 有効期限: Supabaseのトークン有効期限に従う

#### JWTの設定（Supabaseが生成）
- subクレーム: ユーザーID（Supabase UUID）
- emailクレーム: ユーザーメールアドレス
- user_metadataクレーム: username, role等のカスタム情報
- roleクレーム: authenticated/anon（Supabaseの内部ロール）

### Go API連携
- **JWT検証**: SupabaseのJWT SecretをGo側でも設定し、同じキーで検証
- **認証方式**: `Authorization: Bearer <token>`ヘッダー
- **ユーザー情報**: JWTのクレームからユーザーID・メタデータを取得


## 認可設計

### ロール管理
ユーザーのロール情報は`user_metadata.role`に保存し、以下の権限体系を採用：

#### user（一般ユーザー）
- 記事の一覧表示、詳細表示
- 自身の記事の投稿、編集、削除
- いいね、保存機能
- プロフィール表示・編集
- コメント投稿・編集・削除（自身のコメントのみ）

#### admin（管理者）
- user権限の全て
- 全ユーザーの記事・コメントの管理（編集・削除）
- ユーザー管理
- システム設定

### アクセス制御
#### フロントエンド（middleware.ts）
- **保護されたページ**: `/dashboard`, `/profile`, `/articles/new`, `/articles/edit`
- **認証ページ**: `/login`, `/signup`（認証済みユーザーは`/dashboard`にリダイレクト）
- **未認証時**: 保護されたページへのアクセスは`/login`にリダイレクト

#### バックエンド（Go API）
- JWT検証ミドルウェアで全API保護
- ロールベースの認可制御
- リソース所有者チェック（記事・コメントの編集・削除）

### 実装状況
- ✅ Route Handler（login, signup, logout）
- ✅ username・roleのuser_metadata保存
- 🚧 middleware.ts（認証チェック・リダイレクト）
- ⏳ api.ts修正（Route Handler呼び出し）
- ⏳ 認証状態管理（React Context）



