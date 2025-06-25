// Package app はラーメンブログプラットフォームのメインアプリケーション構造体とHTTPサーバーを提供します。
package app

import (
	"log/slog"
	"net/http"
	"os"
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
	Port    string
	BaseURL string
}

// New は新しいAppインスタンスをデフォルト設定で作成・初期化します。
// 構造化ログ、HTTPルーティングを設定し、使用可能なAppを返します。
func New() *App {
	// デフォルト設定
	config := &Config{
		Port:    getEnv("SERVER_PORT", "8080"),
		BaseURL: getEnv("API_BASE_URL", "http://localhost:8080"),
	}

	// 構造化ログの設定
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	// ルーター作成
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
	// 基本的なルート設定
	a.router.HandleFunc("GET /api/v1/articles", a.getArticles)
	a.router.HandleFunc("POST /api/v1/articles", a.createArticle)
	// a.router.HandleFunc("GET /api/v1/articles/{id}", a.getArticle)
	// a.router.HandleFunc("PUT /api/v1/articles/{id}", a.updateArticle)
	// a.router.HandleFunc("DELETE /api/v1/articles/{id}", a.deleteArticle)

	// a.router.HandleFunc("/api/v1/auth/login", a.handleLogin)
	// a.router.HandleFunc("/api/v1/auth/register", a.handleRegister)
}

// func (a *App) HandleFunc(method, path string, handler func(w http.ResponseWriter, r *http.Request){
// 	fullPath := fmt.Sprintf("%s %s", method, a.config.baseURL+path)
// 	a.router.HandleFunc(fullPath, handler)
// })

// getEnv は環境変数の値を取得するか、設定されていない場合はデフォルト値を返します。
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func (a *App) getArticles(w http.ResponseWriter, r *http.Request) {
	a.logger.Info("記事一覧取得リクエスト")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"articles":[]}`)) 
}

func (a *App) createArticle(w http.ResponseWriter, r *http.Request) {
	a.logger.Info("記事作成リクエスト")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"message":"記事を作成しました"}`)) 
}
