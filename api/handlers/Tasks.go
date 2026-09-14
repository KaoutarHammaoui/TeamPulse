package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"auth/middleweare"
	"auth/models"

	"github.com/go-chi/chi/v5"
)

type TaskStructure struct {
	ProjectName   string    `json:"projectname"`
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

type UpdateTaskStruct struct {
	ProjectId   *int    `json:"projectid"`
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Status      *string `json:"status"`
	Priority    *string `json:"priority"`
	Due_date    *string `json:"due_date"`
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
	if TaskCreation.Status != "" && !validStatuses[TaskCreation.Status] {
		http.Error(w, "invalid status value", 400)
		return
	}

	validPriorities := map[string]bool{"low": true, "medium": true, "high": true}
	if TaskCreation.Priority != "" && !validPriorities[TaskCreation.Priority] {
		http.Error(w, "invalid priority value", 400)
		return
	}

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error in getting role", 401)
		return
	}

	var projectID int
	var existQuery string
	existArgs := []interface{}{}
	if role == string(models.AdminRole) {
		existQuery = `SELECT id FROM projects WHERE title=?`
		existArgs = append(existArgs, TaskCreation.ProjectName)
	} else {
		existQuery = `SELECT id FROM projects WHERE title=? AND user_id=?`
		existArgs = append(existArgs, TaskCreation.ProjectName, UserID)
	}
	err := h.DB.QueryRow(existQuery, existArgs...).Scan(&projectID)
	if err != nil {
		http.Error(w, "project not found", 404)
		return
	}

	query := `INSERT INTO tasks (project_id,title,description,status,priority,due_date) VALUES (?,?,?,?,?,?)`
	if TaskCreation.Status == "" {
		TaskCreation.Status = "todo"
	}
	if TaskCreation.Priority == "" {
		TaskCreation.Priority = "medium"
	}
	if TaskCreation.Due_date == "" {
		TaskCreation.Due_date = time.Now().AddDate(0, 1, 0).Format("2006-01-02 15:04:05")
	}

	Insertion, err := h.DB.Exec(query, projectID, TaskCreation.Title, TaskCreation.Description, TaskCreation.Status, TaskCreation.Priority, TaskCreation.Due_date)
	if err != nil {
		log.Println("insert error:", err)
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
	json.NewEncoder(w).Encode(TaskStructureResp{ID: int(lastIns), Title: TaskCreation.Title, Description: TaskCreation.Description, Due_date: TaskCreation.Due_date, ProjectId: projectID, Status: TaskCreation.Status, Priority: TaskCreation.Priority})
}

func (h *AuthHandler) GetAllProjectTasks(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", 405)
		return
	}

	UserId, ok := r.Context().Value(middleweare.UserIDKey).(int)
	if !ok {
		http.Error(w, "error in getting the user id", 400)
		return
	}

	page, errP := strconv.Atoi(r.URL.Query().Get("page"))
	if errP != nil || page < 1 {
		page = 1
	}
	limit, errL := strconv.Atoi(r.URL.Query().Get("limit"))
	if errL != nil || limit < 1 {
		limit = 10
	}
	if limit>100{
		limit=100
	}
	offset := (page - 1) * limit

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error in getting role", 401)
		return
	}

	validStatuses := map[string]bool{"todo": true, "in_progress": true, "done": true}

	statusQ:=string(r.URL.Query().Get("status"))
	status:=strings.TrimSpace(statusQ)
	if status!=""{
		if !validStatuses[status]{
			http.Error(w,"invalid status",401)
			return
		}
	}

	idFromQuery, err := strconv.Atoi(r.URL.Query().Get("project_id"))
	if err != nil {
		http.Error(w, "error in converting the user id to int", 500)
		return
	}
	var exists int
	var existQuery string
	args := []interface{}{}
	if role == string(models.AdminRole) {
		existQuery = `SELECT id FROM projects WHERE id=?`
		args = append(args, idFromQuery)
	} else {
		existQuery = `SELECT id FROM projects WHERE id=? AND user_id=? `
		args = append(args, idFromQuery, UserId)
	}

	ExistInsertionErr := h.DB.QueryRow(existQuery, args...).Scan(&exists)
	if ExistInsertionErr != nil {
		http.Error(w, "error in id", 400)
		return
	}

	query := `SELECT id,title,description,status,priority,due_date FROM tasks WHERE project_id=?`
	QueryArgs:=[]interface{}{idFromQuery}
	if status!=""{
		query+=` AND status=?`
		QueryArgs=append(QueryArgs, status)
	}

	query+=` LIMIT ? OFFSET ?`
	QueryArgs=append(QueryArgs, limit,offset)

	Insertion, err := h.DB.Query(query,QueryArgs...)
	if err != nil {
		http.Error(w, "error querying tasks", 500)
		return
	}
	defer Insertion.Close()
	tasksSlice := []TaskStructureResp{}
	for Insertion.Next() {
		var id int
		var title string
		var description string
		var status string
		var priority string
		var due_date string

		Inserr := Insertion.Scan(&id, &title, &description, &status, &priority, &due_date)
		if Inserr != nil {
			http.Error(w, "error in scan step", 500)
			return
		}
		task := TaskStructureResp{ID: id, ProjectId: idFromQuery, Title: title, Description: description, Status: status, Priority: priority, Due_date: due_date}
		tasksSlice = append(tasksSlice, task)

	}

	if Insertion.Err() != nil {
		http.Error(w, "error in getting data in next loop", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(&tasksSlice)
}

func (h *AuthHandler) GetOneTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", 405)
		return
	}

	idParam, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "error in id", 500)
		return
	}
	userId, ok := r.Context().Value(middleweare.UserIDKey).(int)
	if !ok {
		http.Error(w, "error in getting user id", 405)
		return
	}

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error in getting role from context", 401)
		return
	}

	var query string
	args := []interface{}{}
	if role == string(models.AdminRole) {
		query = `SELECT t.id,t.project_id,t.title,t.description,t.status,t.priority,t.due_date FROM tasks t JOIN projects p ON t.project_id=p.id WHERE t.id=?`
		args = append(args, idParam)

	} else {
		query = `SELECT t.id,t.project_id,t.title,t.description,t.status,t.priority,t.due_date FROM tasks t JOIN projects p ON t.project_id=p.id WHERE t.id=? AND p.user_id=?`
		args = append(args, idParam, userId)

	}
	var Id, projectID int
	var title string
	var description string
	var status string
	var priority string
	var due_Date string

	respErr := h.DB.QueryRow(query, args...).Scan(&Id, &projectID, &title, &description, &status, &priority, &due_Date)
	if respErr != nil {
		http.Error(w, "not found", 404)
		return
	}

	Task := TaskStructureResp{ID: Id, ProjectId: projectID, Title: title, Description: description, Status: status, Priority: priority, Due_date: due_Date}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(&Task)
}

func (h *AuthHandler) UpdateTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "method not allowed", 405)
		return
	}
	TaskId, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "error in task id", 400)
		return
	}

	UserId, ok := r.Context().Value(middleweare.UserIDKey).(int)
	if !ok {
		http.Error(w, "error in getting user id", 400)
		return
	}

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error in getting role from context", 401)
		return
	}

	task := UpdateTaskStruct{}
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "error in decoding body", 400)
		return
	}
	if task.Description == nil && task.Due_date == nil && task.Priority == nil && task.ProjectId == nil && task.Status == nil && task.Title == nil {
		http.Error(w, "u must fill at least 1 filed", 400)
		return
	}
	Clause := []string{}
	args := []interface{}{}

	if task.ProjectId != nil {
		prId := *task.ProjectId
		if prId <= 0 {
			http.Error(w, "project id is invalid", 400)
			return
		}
		var projectID int
		var query string
		QueryArgs := []interface{}{}
		if role == string(models.AdminRole) {
			query = `SELECT id FROM projects WHERE id=?`
			QueryArgs = append(QueryArgs, prId)

		} else {
			query = `SELECT id FROM projects WHERE id=? AND user_id=?`
			QueryArgs = append(QueryArgs, prId, UserId)
		}
		err := h.DB.QueryRow(query, QueryArgs...).Scan(&projectID)
		if err != nil {
			http.Error(w, "project not found", 404)
			return
		}
		Clause = append(Clause, "project_id=?")
		args = append(args, prId)
	}

	if task.Title != nil {
		title := strings.TrimSpace(*task.Title)
		if title == "" {
			http.Error(w, "title cannot be empty", 400)
			return
		}
		Clause = append(Clause, "title=?")
		args = append(args, title)
	}

	if task.Description != nil {
		Description := strings.TrimSpace(*task.Description)
		if Description == "" {
			http.Error(w, "Content cannot be empty", 400)
			return
		}
		Clause = append(Clause, "description=?")
		args = append(args, Description)
	}

	if task.Due_date != nil {
		date := strings.TrimSpace(*task.Due_date)
		if date == "" {
			http.Error(w, "Date cannot be empty", 400)
			return
		}
		Clause = append(Clause, "due_date=?")
		args = append(args, date)
	}

	if task.Priority != nil {
		AllowedPriorities := map[string]bool{"low": true, "medium": true, "high": true}
		if !AllowedPriorities[*task.Priority] {
			http.Error(w, "property is not allowed", 400)
			return
		}
		Clause = append(Clause, "priority=?")
		args = append(args, *task.Priority)
	}

	if task.Status != nil {
		AllowedStatus := map[string]bool{"todo": true, "in_progress": true, "done": true}
		if !AllowedStatus[*task.Status] {
			http.Error(w, "status not allowed", 400)
			return
		}
		Clause = append(Clause, "status=?")
		args = append(args, *task.Status)
	}

	var query string

	if role == string(models.AdminRole) {
		query = `UPDATE tasks SET ` + strings.Join(Clause, ", ") + ` WHERE id=?`
		args = append(args, TaskId)
	} else {
		query = `UPDATE tasks SET ` + strings.Join(Clause, ", ") + ` WHERE id=? AND project_id IN (SELECT id FROM projects WHERE user_id=?)`
		args = append(args, TaskId, UserId)
	}

	res, err := h.DB.Exec(query, args...)
	if err != nil {
		http.Error(w, "insertion error", 500)
		return

	}
	AffectedRows, err := res.RowsAffected()
	if err != nil {
		http.Error(w, "error while counting affected rows", 500)
		return
	}
	if AffectedRows == 0 {
		http.Error(w, "no row was changed", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(&UpdateTaskStruct{ProjectId: task.ProjectId, Title: task.Title, Description: task.Description, Due_date: task.Due_date, Status: task.Status, Priority: task.Priority})
}

func (h *AuthHandler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "method not allowed", 405)
		return
	}

	UserId, ok := r.Context().Value(middleweare.UserIDKey).(int)
	if !ok {
		http.Error(w, "error in getting user id", 400)
		return
	}

	role, ok := r.Context().Value(middleweare.RoleKey).(string)
	if !ok {
		http.Error(w, "error in getting role from contrext", 401)
		return
	}

	TaskId, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "error in converting id to int", 400)
		return
	}

	var query string
	args := []interface{}{}

	if role == string(models.AdminRole) {
		query = `DELETE FROM tasks WHERE id=?`
		args = append(args, TaskId)

	} else {
		query = `DELETE FROM tasks WHERE id=? AND project_id IN (SELECT id FROM projects WHERE user_id=?)`
		args = append(args, TaskId, UserId)
	}

	QueryREsp, err := h.DB.Exec(query, args...)
	if err != nil {
		http.Error(w, "error in deletiob", 500)
		return
	}
	rowDeleted, err := QueryREsp.RowsAffected()
	if err != nil {
		http.Error(w, "no row was affected", 500)
		return
	}
	if rowDeleted == 0 {
		http.Error(w, "task wasn't found", 404)
		return
	}

	w.WriteHeader(204)
}
