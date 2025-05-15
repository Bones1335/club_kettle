package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/club_kettle/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerUpdateExercises(w http.ResponseWriter, r *http.Request) {
	exerciseID := r.PathValue("exercise_id")
	parsedUUID, err := uuid.Parse(exerciseID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "coudn't get UUID", err)
		return
	}

	type parameters struct {
		Name string `json:"name"`
		Tool string `json:"tool"`
	}

	type response struct {
		database.Exercise
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	exercise, err := cfg.db.UpdateExercise(r.Context(), database.UpdateExerciseParams{
		ID:   parsedUUID,
		Name: params.Name,
		Tool: params.Tool,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't update exercise", err)
		return
	}

	respondWithJSON(w, http.StatusOK, response{
		database.Exercise{
			ID:        exercise.ID,
			Name:      exercise.Name,
			Tool:      exercise.Tool,
			UserID:    exercise.UserID,
		},
	})
}
