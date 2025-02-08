package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Bones1335/workout_api/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type apiConfig struct {
	db       *database.Queries
	platform string
}

func main() {
	godotenv.Load()
	dbURL := os.Getenv("DB_URL")
	platform := os.Getenv("PLATFORM")

	const filepathRoot = "."
	const port = "8080"

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		fmt.Printf("Error connecting to DB: %v", err)
	}

	dbQueries := database.New(db)

	apiCfg := apiConfig{
		db:       dbQueries,
		platform: platform,
	}

	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", handlerReadiness)

	mux.HandleFunc("POST /admin/reset", apiCfg.handlerReset)

	mux.HandleFunc("POST /api/users", apiCfg.handlerCreateUser)

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	fmt.Printf("Config: %v\n", apiCfg)

	log.Printf("Serving files from %s on port: %s\n", filepathRoot, port)
	log.Fatal(srv.ListenAndServe())

}
