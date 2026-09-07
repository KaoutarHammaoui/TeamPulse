package handlers

import (
	"encoding/json"
	"net/http"

	"auth/middleweare"
)

type RequestStruct struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type ProjectResponse struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func (h *AuthHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed in post insertion", 405)
		return
	}
	UserId, ok := r.Context().Value(middleweare.UserIDKey).(int)
	if !ok {
		http.Error(w, "error in getting user id", 401)
		return
	}
	ProjectStruct := RequestStruct{}
	ProjectBody := r.Body
	ProjectDecoding := json.NewDecoder(ProjectBody).Decode(&ProjectStruct)
	if ProjectDecoding != nil {
		http.Error(w, "error in decoding body", 400)
		return
	}
	query := `INSERT INTO projects(user_id,title,description) VALUES (?,?,?) `

	if ProjectStruct.Title == "" {
		http.Error(w, "title is required", http.StatusBadRequest)
		return
	}
	resp, err := h.DB.Exec(query, UserId, ProjectStruct.Title, ProjectStruct.Content)
	if err != nil {
		http.Error(w, "error in insertion", 500)
		return
	}

	lastIns, err := resp.LastInsertId()
	if err != nil {
		http.Error(w, "error in insertion", 500)
		return
	}

	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(201)
	json.NewEncoder(w).Encode(ProjectResponse{ID: lastIns, Title: ProjectStruct.Title, Description: ProjectStruct.Content})
}

func (h *AuthHandler) GetAllProjects(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", 405)
		return
	}

	userId, ok := r.Context().Value(middleweare.UserIDKey).(int)
	if !ok {
		http.Error(w, "error in getting user id", 401)
		return
	}
	query := `SELECT id,title,description FROM projects WHERE user_id=?`
	resp, err := h.DB.Query(query, userId)
	if err != nil {
		http.Error(w, "error in getting projects data", 500)
		return
	}
	defer resp.Close()
	var Projects []ProjectResponse

	for resp.Next() {
		var Id int
		var title string
		var content string

		if err:=resp.Err();err!=nil{
			http.Error(w, "error reading project data", 500)
			return
		}

		if err := resp.Scan(&Id, &title, &content); err != nil {
			http.Error(w, "error readinf project data", 500)
			return
		}
		pr := ProjectResponse{ID: int64(Id), Title: title, Description: content}
		Projects = append(Projects, pr)
	}
	w.Header().Set("Content-Type","application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(Projects)
}
