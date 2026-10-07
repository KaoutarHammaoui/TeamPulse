package main

import (
	"log"
	"net/http"
	"os"

	"auth/db"
	"auth/handlers"
	"auth/middleweare"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load() // readas .env and makes jwt_secret available via os.getenv
	secret := []byte(os.Getenv("JWT_SECRET"))

	Dbase, err := db.Connect("../app.db")
	if err != nil {
		log.Fatal(err)
		return
	}
	defer Dbase.Close()
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
		r.Patch("/UpdateUserRole/{id}",authHandler.UpdatingRole)
		r.Get("/Users",authHandler.GetAllUsers)
		r.Get("/GetUser/{id}",authHandler.GetUser)
		r.Get("/logout",authHandler.Logout)
	})

	log.Println("server is running on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
