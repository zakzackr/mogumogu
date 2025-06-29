package service

import (
	"net/http"

	apperrors "github.com/zakzackr/ramen-blog/backend/internal/errors"
	"github.com/zakzackr/ramen-blog/backend/internal/model"
	"github.com/zakzackr/ramen-blog/backend/internal/repository"
)

type ArticleService struct {
	// DI
	articleRepo *repository.ArticleRepository
}

// コンストラクタ
func NewArticleService(articleRepo *repository.ArticleRepository) *ArticleService {
	return &ArticleService{
		articleRepo: articleRepo,
	}
}

func (s *ArticleService) GetArticleById(id int64) (*model.Article, *apperrors.AppError) {
	if id <= 0 {
		return nil, apperrors.NewAppError(
			"INVALID_ARTICLE_ID",
			"記事IDが適切ではありません。",
			http.StatusBadRequest,
			nil,
		)
	}

	article, err := s.articleRepo.GetArticleById(id)
	if err != nil {
		return nil, err
	}

	return article, nil
}
