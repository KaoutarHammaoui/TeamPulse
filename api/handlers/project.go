package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"auth/middleweare"
	"auth/models"

	"github.com/go-chi/chi/v5"
)

type RequestStruct struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type ProjectResponse struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	CreatedAt   string `json:"created_at"`
}

type UpdateProjectStruct struct {
	Title   *string `json:"title"`
	Content *string `json:"content"`
}

func (h *AuthHandler) CreateProject(w http.ResponseWriter, r *http.Request) {
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
	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error in getting role", 401)
		return
	}

	page, errQ := strconv.Atoi(r.URL.Query().Get("page"))
	if errQ != nil || page < 1 {
		page = 1
	}
	limit, errL := strconv.Atoi(r.URL.Query().Get("limit"))
	if errL != nil || limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit
	var query string
	var resp *sql.Rows
	var err error
	if role == string(models.AdminRole) {
		query = `SELECT id,title,description FROM projects ORDER BY id DESC LIMIT ? OFFSET ?`
		resp, err = h.DB.Query(query, limit, offset)
	} else {
		query = `SELECT id,title,description FROM projects WHERE user_id=? ORDER BY id DESC LIMIT ? OFFSET ?`
		resp, err = h.DB.Query(query, userId, limit, offset)
	}

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

		if err := resp.Err(); err != nil {
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
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(Projects)
}

func (h *AuthHandler) GetProject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", 405)
		return
	}
	idParam, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Error in converting the id to int", 500)
		return
	}
	UserId, ok := r.Context().Value(middleweare.UserIDKey).(int)
	if !ok {
		http.Error(w, "Error in getting user id", 401)
		return
	}

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error in getting role from context", 401)
		return
	}

	var respErr error
	var Id int
	var title string
	var description string
	var createdAt string
	if role == string(models.AdminRole) {
		query := `SELECT id,title,description,created_at FROM projects WHERE id=?`
		respErr = h.DB.QueryRow(query, idParam).Scan(&Id, &title, &description, &createdAt)
	} else {
		query := `SELECT id,title,description,created_at FROM projects WHERE id=? AND user_id=?`
		respErr = h.DB.QueryRow(query, idParam, UserId).Scan(&Id, &title, &description, &createdAt)
	}

	if respErr != nil {
		http.Error(w, "Project doesn't exist", 404)
		return
	}
	Project := ProjectResponse{ID: int64(Id), Title: title, Description: description, CreatedAt: createdAt}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(Project)
}

func (h *AuthHandler) DeleteProject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "method not allowed", 405)
		return
	}
	UserID, ok := r.Context().Value(middleweare.UserIDKey).(int)
	if !ok {
		http.Error(w, "erro in getting user id", 500)
		return
	}

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error in getting role from context", 401)
		return
	}

	IdParam, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "erro in getting user id", 500)
		return
	}

	var query string
	args := []interface{}{}
	if role == string(models.AdminRole) {
		query = `DELETE FROM projects WHERE id=?`
		args = append(args, IdParam)
	} else {
		query = `DELETE FROM projects WHERE id=? AND user_id=?`
		args = append(args, IdParam, UserID)
	}
	resp, err := h.DB.Exec(query, args...)
	if err != nil {
		http.Error(w, "error deleting project", 500)
		return
	}

	rowsAffected, err := resp.RowsAffected()
	if err != nil {
		http.Error(w, "error deleting project", 500)
		return
	}
	if rowsAffected == 0 {
		http.Error(w, "project not found", 404)
		return
	}
	w.WriteHeader(204)
}

func (h *AuthHandler) UpdateProject(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPatch {
		http.Error(w, "method not allowed", 405)
		return
	}

	userId, ok := r.Context().Value(middleweare.UserIDKey).(int)
	if !ok {
		http.Error(w, "error in getting the userID", 401)
		return
	}

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error in getting role", 401)
		return
	}

	ProjectId, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "error in converting id to int", 400)
		return
	}

	pr := UpdateProjectStruct{}

	if err := json.NewDecoder(r.Body).Decode(&pr); err != nil {
		http.Error(w, "error in decoding body", 400)
		return
	}
	if pr.Title == nil && pr.Content == nil {
		http.Error(w, "both title and content are empty", 400)
		return
	}

	setClause := []string{}
	args := []interface{}{}

	if pr.Title != nil {
		title := strings.TrimSpace(*pr.Title)
		if title == "" {
			http.Error(w, "title cannot be empty", http.StatusBadRequest)
			return
		}
		setClause = append(setClause, "title=?")
		args = append(args, *pr.Title)
	}
	if pr.Content != nil {
		content := strings.TrimSpace(*pr.Content)
		if content == "" {
			http.Error(w, "Content cannot be empty", http.StatusBadRequest)
			return
		}
		setClause = append(setClause, "description=?")
		args = append(args, *pr.Content)
	}

	var query string
	if role == string(models.AdminRole) {
		query = `UPDATE projects SET ` + strings.Join(setClause, ", ") + ` WHERE id=? `
		args = append(args, ProjectId)

	} else {
		query = `UPDATE projects SET ` + strings.Join(setClause, ", ") + ` WHERE id=? AND user_id=?`
		args = append(args, ProjectId, userId)
	}

	res, err := h.DB.Exec(query, args...)
	if err != nil {
		http.Error(w, "error in execution", 500)
		return
	}
	AffectedRows, err := res.RowsAffected()
	if err != nil || AffectedRows == 0 {
		http.Error(w, "no row was affected", 404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(&UpdateProjectStruct{Title: pr.Title, Content: pr.Content})
}
