package handlers

import (
	"encoding/json"
	"net/http"

	"auth/middleweare"
)

type TaskStructure struct {
	ProjectId   int    `json:"projectid"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	Priority    string `json:"priority"`
	Due_date    string `json:"due_date"`
}

type TaskStructureResp struct {
	ID          int    `json:"id"`
	ProjectId   int    `json:"projectid"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	Priority    string `json:"priority"`
	Due_date    string `json:"due_date"`
}

func (h *AuthHandler) CreateTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", 405)
		return
	}

	UserID, ok := r.Context().Value(middleweare.UserIDKey).(int)
	if !ok {
		http.Error(w, "error in getting the user id", 400)
		return
	}

	TaskCreation := TaskStructure{}
	TaskDecoding := json.NewDecoder(r.Body).Decode(&TaskCreation)
	if TaskDecoding != nil {
		http.Error(w, "error in decoding body", 400)
		return
	}

	if TaskCreation.Title == "" || TaskCreation.Description == "" {
		http.Error(w, "Title and Description must be remplied", 400)
		return
	}

	validStatuses := map[string]bool{"todo": true, "in_progress": true, "done": true}
	if !validStatuses[TaskCreation.Status] {
		http.Error(w, "invalid status value", 400)
		return
	}

	validPriorities := map[string]bool{"low": true, "medium": true, "high": true}
	if !validPriorities[TaskCreation.Priority] {
		http.Error(w, "invalid priority value", 400)
		return
	}

	var exists int
	err := h.DB.QueryRow(`SELECT id FROM projects WHERE id=? AND user_id=?`, TaskCreation.ProjectId, UserID).Scan(&exists)
	if err != nil {
		http.Error(w, "project not found", 404)
		return
	}

	query := `INSERT INTO tasks (project_id,title,description,status,priority,due_date) VALUES (?,?,?,?,?,?)`
	Insertion, err := h.DB.Exec(query, TaskCreation.ProjectId, TaskCreation.Title, TaskCreation.Description, TaskCreation.Status, TaskCreation.Priority, TaskCreation.Due_date)
	if err != nil {
		http.Error(w, "error in insertion", 500)
		return
	}
	lastIns, err := Insertion.LastInsertId()
	if err != nil {
		http.Error(w, "error", 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(201)
	json.NewEncoder(w).Encode(TaskStructureResp{ID: int(lastIns), Title: TaskCreation.Title, Description: TaskCreation.Description, Due_date: TaskCreation.Due_date, ProjectId: TaskCreation.ProjectId, Status: TaskCreation.Status, Priority: TaskCreation.Priority})
}
