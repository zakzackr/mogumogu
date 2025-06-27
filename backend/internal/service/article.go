package service

import {
	"github.com/zakzackr/ramen-blog/backend/internal/repository" 
}

type ArticleService struct {
	// DI
	articleRepo *repository.ArticleRepository
}

// コンストラクタ
func NewArticleService (articleRepo *repository.ArticleRepository) *ArticleService {
	return &ArticleService{
		articleRepo: articleRepo
	}
}

func (s *ArticleService) getArticleById(id int64) (*model.Article, error) {
	if id <= 0 {
		return nil, errors.New("記事IDが適切ではありません。") 
	}

	return s.articleRepo.getArticleById(id)
}