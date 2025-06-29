package model

import "time"

// DB保存用のArticleデータ
type Article struct {
	ID         int64     `json:"id"`
	UserId     int64     `json:"authorId"`
	Title      string    `json:"title"`
	Body       string    `json:"body"`
	LikeCount  int       `json:"likeCount"`
	StockCount int       `json:"stockCount"`
	ImageUrls  []string  `json:"imageUrls"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

// リクエスト用のArticleデータ
type CreateArticle struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}
