package models

type Project struct {
	UserId      int    `json:"userid"`
	Title       string `json:"title"`
	Description string `json:"description"`
	CreatedAt   string `json:"createdat"`
}
