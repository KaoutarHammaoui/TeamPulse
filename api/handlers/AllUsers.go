package handlers

import (
	"auth/middleweare"
	"auth/models"
	"encoding/json"
	"net/http"
)

type UserResponse struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}

func (h *AuthHandler) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", 405)
		return
	}

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error getting role", 401)
		return
	}
	if role != string(models.AdminRole) {
		http.Error(w, "forbidden: admin only", 403)
		return
	}

	rows, err := h.DB.Query(`SELECT id, username, email, role FROM users`)
	if err != nil {
		http.Error(w, "error fetching users", 500)
		return
	}
	defer rows.Close()

	users := []UserResponse{}
	for rows.Next() {
		var u UserResponse
		if err := rows.Scan(&u.ID, &u.Username, &u.Email, &u.Role); err != nil {
			http.Error(w, "error reading user data", 500)
			return
		}
		users = append(users, u)
	}
	if rows.Err() != nil {
		http.Error(w, "error iterating users", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(users)
}
