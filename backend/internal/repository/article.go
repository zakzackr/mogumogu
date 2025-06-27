package repository

import (
	"database/sql"
	"errors"
	"github.com/zakzackr/ramen-blog/backend/internal/model" 
)

ArticleRepository {
	db *sql.DB
}

func NewArticleRepository(db *sql.DB) *ArticleRepository {
	return &ArticleRepository{
		db: db
	}
}

func (r *ArticleHandler) GerArticleById(id int64) (*model.Article, error) {
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
			return nil, errors.New("記事が見つかりませんでした。")
		}
		return nil, err
	}

	return article, nil
}