package repository

import (
	"database/sql"
	"http"
	"errors"

	"github.com/zakzackr/ramen-blog/backend/internal/model" 
	apperrors "github.com/zakzackr/ramen-blog/backend/internal/errors" 
)

type ArticleRepository struct{
	db *sql.DB
}

func NewArticleRepository(db *sql.DB) *ArticleRepository {
	return &ArticleRepository{
		db: db
	}
}

func (r *ArticleRepository) GerArticleById(id int64) (*model.Article, error) {
	//ゼロ値で初期化
	article := &model.Article{}

	// queryを作成
	query := `
		SELECT id, author_id, title, body, like_count, stock_count, image_urls, created_at, updated_at
		FROM articles
		WHERE id = $1
	`

	row := r.db.QueryRow(query, id)
	err := row.Scan(
		&article.ID,
		&article.UserId,
		&article.Title,
		&article.Body,
		&article.LikeCount,
		&article.StockCount,
		&article.ImageUrls,
		&article.CreatedAt,
		&article.UpdatedAt
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperrors.NewAppError(
				"ARTICLE_NOT_FOUND",
				"記事が見つかりませんでした。",
				http.StatusNotFound,
				err
			)
		}
		return nil, err
	}

	return article, nil
}