// Package app はラーメンブログプラットフォームのメインアプリケーション構造体とHTTPサーバーを提供します。
package app

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/zakzackr/ramen-blog/backend/internal/middleware"
)

// App はラーメンブログプラットフォームのメインアプリケーション構造体です。
// ルーター、設定、ログ機能を含みます。
type App struct {
	router *http.ServeMux
	config *Config
	logger *slog.Logger
}

// Config はポート番号とベースURLを含むアプリケーション設定を保持します。
type Config struct {
	port    string
	baseURL string
}

// New は新しいAppインスタンスをデフォルト設定で作成・初期化します。
// 構造化ログ、HTTPルーティングを設定し、使用可能なAppを返します。
func New() *App {
	// デフォルト設定
	config := &Config{
		port:    getEnv("SERVER_PORT", "8080"),
		baseURL: getEnv("API_BASE_URL", "http://localhost:8080"),
	}

	// 構造化ログの設定
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	// ルーター作成
	// ServeHttp()が、登録されたハンドラーを呼び出す
	router := http.NewServeMux()

	app := &App{
		router: router,
		config: config,
		logger: logger,
	}

	// ルートを設定
	app.setupRoutes()

	return app
}

// Loggerのみ取得可能にする
func (a *App) Logger() *slog.Logger {
	return a.logger
}

// TODO: middlewareに移行

// ServeHTTP はhttp.Handlerインターフェースを実装し、AppがHTTPリクエストを処理できるようにします。
// 受信リクエストをログに記録し、内部ルーターに委譲します。
func (a *App) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// リクエストログ
	a.logger.Info("Request", "method", r.Method, "path", r.URL.Path)

	// CORS設定                                                    
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8081")   
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// preflightリクエストの処理
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// ルーターに委譲
	a.router.ServeHTTP(w, r)
}

// setupRoutes はラーメンブログAPIエンドポイントのすべてのHTTPルートを設定します。
func (a *App) setupRoutes() {
	// ハンドラー初期化
	articleHandler := handler.NewArticleHandler(a.logger)

	// 基本的なルート設定
	// Handle関数で、ハンドラーを登録する
	// a.router.HandleFunc("GET /api/v1/articles", articleHandler.GetArticles)
	// errorを返すため、Handle関数を使用
	a.router.Handle("GET /api/v1/articles", middleware.AppHandler(articleHandler.GetArticles))
	a.router.Handle("POST /api/v1/articles", middleware.AppHandler(articleHandler.CreateArticle))
	a.router.Handle("GET /api/v1/articles/{id}", middleware.AppHandler(articleHandler.GetArticle))
	// a.router.HandleFunc("PUT /api/v1/articles/{id}", a.updateArticle)
	// a.router.HandleFunc("DELETE /api/v1/articles/{id}", a.deleteArticle)

	// a.router.HandleFunc("/api/v1/auth/login", a.handleLogin)
	// a.router.HandleFunc("/api/v1/auth/register", a.handleRegister)
}

// getEnv は環境変数の値を取得するか、設定されていない場合はデフォルト値を返します。
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

