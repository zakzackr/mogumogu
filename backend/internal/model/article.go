package model

import "time"

type Article struct {
	ID int64 `json: "id"`
	UserId int64 `json: "authorId"`
	Title string `json: "title"`
	Body string `json: "body"`
	ImageUrls []string `json: "imageUrls"`
	LikeCount int `json: "likeCount"`
	MvpCount int `json: "mvpCount`
	CreatedAt time.Time `json: "createdAt"`
	UpdatedAt time.Time `json: "updatedAt"`
}