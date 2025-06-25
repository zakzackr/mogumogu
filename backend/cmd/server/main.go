package main

import (
	"log"
	"net/http"

	"github.com/zakzackr/ramen-blog/backend/internal/app"
)


func main() {
	// app構造体の作成
	// ルーティング設定
	api := app.New()

	// HTTPサーバーを起動
	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", api))
}
