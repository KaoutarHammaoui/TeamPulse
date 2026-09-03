package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"regexp"

	"auth/auth"
	"auth/models"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterResponse struct {
	ID       int64  `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type AuthHandler struct {
	DB *sql.DB
	Secret []byte
}

func (h *AuthHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "MEthod is not allowed. Only post method is allowed", http.StatusMethodNotAllowed)
		return
	}
	userStream := r.Body
	userStruct := RegisterRequest{}
	userInfo := json.NewDecoder(userStream).Decode(&userStruct)
	if userInfo != nil {
		http.Error(w, "user data couldn't be fetched", http.StatusBadRequest)
		return
	}

	if len(userStruct.Username) < 3 || userStruct.Username == "" {
		http.Error(w, "username must be at least 3 characters", http.StatusBadRequest)
		return
	}

	if len(userStruct.Password) < 5 {
		http.Error(w, "password must contain 5 chars at least", http.StatusBadRequest)
		return
	}

	Maatched, _ := regexp.MatchString(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, userStruct.Email)
	if Maatched != true {
		http.Error(w, "this email is invalid", http.StatusBadRequest)
		return
	}
	checkMail := `SELECT email FROM users WHERE email=?`
	isThere := ""
	err := h.DB.QueryRow(checkMail, userStruct.Email).Scan(&isThere)
	if err == nil {
		http.Error(w, "this email already exists", http.StatusBadRequest)
		return
	}

	hashed, err := auth.HashPassword(userStruct.Password)
	if err != nil {
		http.Error(w, "error in password", http.StatusBadRequest)
		return
	}

	query := `INSERT INTO users (username,email,password_hash,role) VALUES (?,?,?,?)`
	ins, errE := h.DB.Exec(query, userStruct.Username, userStruct.Email, hashed, string(models.UserRole))
	if errE != nil {
		http.Error(w, "error in insertion", http.StatusInternalServerError)
		return
	}

	newID, err := ins.LastInsertId()
	if err != nil {
		http.Error(w, "error in insertion", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(RegisterResponse{ID: newID, Username: userStruct.Username, Email: userStruct.Email})
}
