package model

// Errorメッセージの統一形式
type ErrorResponse struct {
	Message string `json:"message"`
	Code    string `json:"code"`
}