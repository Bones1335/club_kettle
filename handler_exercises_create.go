package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/workout_api/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerCreateExercises(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name   string    `json:"name"`
		Tool   string    `json:"tool"`
		UserID uuid.UUID `json:"user_id"`
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
		UserID: params.UserID,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't create exercise", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, response{
		database.Exercise{
			ID:        exercise.ID,
			CreatedAt: exercise.CreatedAt,
			UpdatedAt: exercise.UpdatedAt,
			Name:      exercise.Name,
			Tool:      exercise.Tool,
			UserID:    exercise.UserID,
		},
	})
}
