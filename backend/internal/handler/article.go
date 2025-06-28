package handler

import (
	"log/slog"
	"http"
	"net/http"
	"strconv"
	"encoding/json"

	"github.com/zakzackr/ramen-blog/backend/internal/service" 
	apperrors "github.com/zakzackr/ramen-blog/backend/internal/errors" 
)

type ArticleHandler struct {
	// DI
	articleService *service.ArticleService,
	logger *slog.Logger
}

func NewArticleHandler(articleService *service.ArticleService, logger *slog.Logger) *ArticleHandler{
	return &ArticleHandler{
		articleService: articleService,
		logger: logger
	}
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

// 記事詳細取得ハンドラー
func (h *ArticleHandler) GetArticle(w http.ResponseWriter, r *http.Request) error {
	h.logger.Info("記事詳細取得リクエスト")
	
	// パス内のarticleIdを取得
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)

	if err != nil {
		return apperrors.NewAppError("INVALID_ARTICLE_ID", "記事IDが無効です",
			http.StatusBadRequest, err)
	}

	// 記事詳細取得サービス関数の呼び出し
	article, err := h.articleService.GetArticleById(id)
	if err != nil {
		return err
	}
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	// json.Encode()時のエラーもグローバルハンドラーで処理
	return json.NewEncoder(w).Encode(article)
}
