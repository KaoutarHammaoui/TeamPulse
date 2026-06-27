package models

import "time"

type role string

const (
	adminRole role = "admin"
	userRole  role = "user"
)

type User struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	Password     []byte    `json:"-"`
	Role         role      `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	TokenVersion int       `json:"token_version"`
}
