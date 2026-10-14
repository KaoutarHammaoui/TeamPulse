package main

import (
	_ "embed"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"auth/db"
	"auth/handlers"
	"auth/middleweare"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

//go:embed schema.sql
var schema string

func main() {
	_ = godotenv.Load() // readas .env and makes jwt_secret available via os.getenv
	secret := []byte(os.Getenv("JWT_SECRET"))

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		switch {
		case fileExists("schema.sql"):
			dbPath = "app.db"
		case fileExists(filepath.Join("api", "schema.sql")):
			dbPath = filepath.Join("api", "app.db")
		default:
			dbPath = "app.db"
		}
	}

	Dbase, err := db.Connect(dbPath)
	if err != nil {
		log.Fatal(err)
		return
	}
	defer Dbase.Close()

	if _, err := Dbase.Exec(schema); err != nil {
		log.Fatal("failed to initialize database schema: ", err)
	}
	authHandler := &handlers.AuthHandler{
		DB:     Dbase,
		Secret: secret,
	}
	r := chi.NewRouter()
	r.Use(middleweare.CORS)
	r.Post("/register", authHandler.CreateUser)
	r.Post("/login", authHandler.Login)

	r.Group(func(r chi.Router) {
		r.Use(func(next http.Handler) http.Handler {
			return middleweare.AuthMiddleware(next, secret)
		})
		r.Get("/me", authHandler.Me)
		r.Post("/CreateProject", authHandler.CreateProject)
		r.Get("/GetProjects", authHandler.GetAllProjects)
		r.Get("/GetProject/{id}", authHandler.GetProject)
		r.Delete("/DeleteProject/{id}", authHandler.DeleteProject)
		r.Patch("/UpdateProject/{id}", authHandler.UpdateProject)
		r.Post("/AddTask", authHandler.CreateTask)
		r.Get("/GetTasks", authHandler.GetAllProjectTasks)
		r.Get("/tasks/{id}", authHandler.GetOneTask)
		r.Patch("/UpdateTask/{id}", authHandler.UpdateTask)
		r.Delete("/DeleteTask/{id}", authHandler.DeleteTask)
		r.Patch("/UpdateUserRole/{id}", authHandler.UpdatingRole)
		r.Get("/Users", authHandler.GetAllUsers)
		r.Get("/GetUser/{id}", authHandler.GetUser)
		r.Post("/logout", authHandler.Logout)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("server is running on :" + port)

	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}

func fileExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && !info.IsDir()
}
