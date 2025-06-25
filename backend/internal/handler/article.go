package handler

import (
	"log/slog"
	"net/http"
)

type ArticleHandler struct {
	logger *slog.Logger
}

func NewArticleHandler(logger *slog.Logger) *ArticleHandler{
	return &ArticleHandler{logger: logger}
}

// 記事一覧取得ハンドラー
func (h *ArticleHandler) GetArticles(w http.ResponseWriter, r *http.Request) {
	h.logger.Info("記事一覧取得リクエスト")
	w.Header().Set("Content-Type", "application/json")
	w.Header().WriteHeader(http.StatusOK)
	w.Write([]byte(`{"articles":[]}`)) 
}

// 記事投稿ハンドラー
func (h *ArticleHandler) CreateArticle(w http.ResponseWriter, r *http.Request) {
	h.logger.Info("記事投稿リクエスト")
	w.Header().Set("Content-type", "application/json")
	// Write()がWriteHeader(http.StatusOK)を自動で呼ぶから、その前に明示的に呼び出す。
	w.Header().WriteHeader(http.StatusCreated)
	// TODO: 配列ではなくarticleをセット
	w.Write([]byte(`{"articles":[]}`))
}
