package handlers

import (
	"auth/middleweare"
	"auth/models"
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (h *AuthHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error getting role", http.StatusUnauthorized)
		return
	}

	if role != string(models.AdminRole) {
		http.Error(w, "forbidden: admin only", http.StatusForbidden)
		return
	}

	id := chi.URLParam(r, "id")

	var user UserResponse

	err := h.DB.QueryRow(
		`SELECT id, username, email, role FROM users WHERE id = ?`,
		id,
	).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Role,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "user not found", http.StatusNotFound)
			return
		}

		http.Error(w, "error fetching user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}
