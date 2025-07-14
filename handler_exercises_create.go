package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/club_kettle/internal/database"
)

func (cfg *apiConfig) handlerCreateExercises(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name   string    `json:"name"`
		Tool   string    `json:"tool"`
	}

	type response struct {
		database.Exercise
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't decode parameters", err)
		return
	}

	exercise, err := cfg.db.CreateExercise(r.Context(), database.CreateExerciseParams{
		Name:   params.Name,
		Tool:   params.Tool,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't create exercise", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, response{
		database.Exercise{
			ID:     exercise.ID,
			Name:   exercise.Name,
			Tool:   exercise.Tool,
		},
	})
}
