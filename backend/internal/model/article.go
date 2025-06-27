package model

import "time"

// DB保存用のArticleデータ
type Article struct {
	ID int64 `json:"id"`
	UserId int64 `json:"authorId"`
	Title string `json:"title"`
	Body string `json:"body"`
	ImageUrls []string `json:"imageUrls"`
	LikeCount int `json:"likeCount"`
	MvpCount int `json:"mvpCount`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// リクエスト用のArticleデータ
type CreateArticle struct {
	Title string `json:"title"`
	Body string `json:"body"`
}