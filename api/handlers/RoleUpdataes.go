package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"auth/middleweare"
	"auth/models"

	"github.com/go-chi/chi/v5"
)

type RoleStruct struct {
	Role string `json:"role"`
}

func (h *AuthHandler) UpdatingRole(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "method not allowed", 405)
		return
	}

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error in reading role from context", 403)
		return
	}
	if role != string(models.AdminRole) {
		http.Error(w, "forbidden: admin only", 403)
		return
	}
	UserIdStr := chi.URLParam(r, "id")
	UserId, err := strconv.Atoi(UserIdStr)
	if err != nil {
		http.Error(w, "invalid user id", 400)
		return
	}
	roleStr:=RoleStruct{}

	DEcoding:=json.NewDecoder(r.Body).Decode(&roleStr)
	if DEcoding!=nil{
		http.Error(w,"error in decoding body",400)
		return
	}

	if roleStr.Role!="admin" && roleStr.Role!="user"{
		http.Error(w,"only user/admin are allowed",400)
		return
	}

	query:=`UPDATE users SET role=? WHERE id=?`
	UpadateSQl,err:= h.DB.Exec(query,roleStr.Role,UserId)
	if err!=nil{
		http.Error(w,"error in insertion",500)
		return
	}
	rowsAffected, err:= UpadateSQl.RowsAffected()
	if rowsAffected==0 || err!=nil{
		http.Error(w,"no rows were changed",404)
		return
	}

	w.WriteHeader(200)
}
