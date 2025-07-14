package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Bones1335/club_kettle/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type apiConfig struct {
	db        *database.Queries
	platform  string
	jwtSecret string
}

func main() {
	godotenv.Load()
	dbURL := os.Getenv("DB_URL")
	platform := os.Getenv("PLATFORM")
	jwtSecret := os.Getenv("JWT_SECRET")

	const filepathRoot = "."
	const port = "8080"

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		fmt.Printf("Error connecting to DB: %v", err)
	}

	dbQueries := database.New(db)

	apiCfg := apiConfig{
		db:        dbQueries,
		platform:  platform,
		jwtSecret: jwtSecret,
	}

	mux := http.NewServeMux()

	fsHandler := http.StripPrefix("/app", http.FileServer(http.Dir(filepathRoot+"/front-end/.")))
	mux.Handle("/app/", fsHandler)

	// Admin endpoints
	mux.HandleFunc("GET /healthz", handlerReadiness)
	mux.HandleFunc("POST /admin/reset", apiCfg.handlerReset)

	// Authentication/Authorization
	mux.HandleFunc("POST /api/login", apiCfg.handlerLogin)
	mux.HandleFunc("POST /api/refresh", apiCfg.handlerRefresh)
	mux.HandleFunc("POST /api/revoke", apiCfg.handlerRevoke)

	// User endpoints
	mux.HandleFunc("POST /api/users", apiCfg.handlerCreateUsers)
	mux.HandleFunc("GET /api/users/", apiCfg.handlerGetUsers)
	mux.HandleFunc("PUT /api/users/{user_id}", apiCfg.handlerUpdateUsers)
	mux.HandleFunc("DELETE /api/users/{user_id}", apiCfg.handlerDeleteUsers)

	// Exercise endpoints
	mux.HandleFunc("POST /api/exercises", apiCfg.handlerCreateExercises)
	mux.HandleFunc("GET /api/exercises", apiCfg.handlerGetExercises)
	mux.HandleFunc("GET /api/exercises/{exercise_id}", apiCfg.handlerGetSingleExercise)
	mux.HandleFunc("PUT /api/exercises/{exercise_id}", apiCfg.handlerUpdateExercises)
	mux.HandleFunc("DELETE /api/exercises/{exercise_id}", apiCfg.handlerDeleteExercises)

	// Workout Endpoints
	mux.HandleFunc("POST /api/workouts", apiCfg.handlerCreateWorkoutRoutines)
	mux.HandleFunc("GET /api/workouts", apiCfg.handlerGetWorkoutRoutines)
	mux.HandleFunc("GET /api/workouts/{workout_id}", apiCfg.handlerGetWorkout)
	mux.HandleFunc("PUT /api/workouts/{workout_id}", apiCfg.handlerUpdateWorkout)
	mux.HandleFunc("DELETE /api/workouts/{workout_id}", apiCfg.handlerDeleteWorkout)

	// Workout Summary Endpoints
	mux.HandleFunc("POST /api/workout_summaries", apiCfg.handlerCreateWorkoutSummaries)
	mux.HandleFunc("GET /api/workout_summaries", apiCfg.handlerGetWorkoutSummaries)
	mux.HandleFunc("GET /api/workout_summaries/{workout_summary_id}", apiCfg.handlerGetSingleWorkoutSummary)
	mux.HandleFunc("DELETE /api/workout_summaries/{workout_summary_id}", apiCfg.handlerDeleteWorkoutSummaries)

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Printf("Serving files from http://localhost:%s/app/\n", port)
	log.Fatal(srv.ListenAndServe())

}
