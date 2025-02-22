package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/workout_api/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerCreateWorkouts(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name          string      `json:"name"`
		Description   string      `json:"description"`
		TotalDuration int         `json:"total_duration"`
		UserID        uuid.UUID   `json:"user_id"`
		TimeSeconds   int         `json:"time_seconds"`
		WeightKg      int         `json:"weight_kg"`
		ExerciseIDs   []uuid.UUID `json:"exercise_id"`
	}

	type response struct {
		database.Workout
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't decode parameters", err)
		return
	}

	workout, err := cfg.db.CreateWorkout(r.Context(), database.CreateWorkoutParams{
		Name:          params.Name,
		Description:   params.Description,
		TotalDuration: int32(params.TotalDuration),
		UserID:        params.UserID,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't create workout", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, response{
		database.Workout{
			ID:            workout.ID,
			Name:          workout.Name,
			Description:   workout.Description,
			TotalDuration: workout.TotalDuration,
			UserID:        workout.UserID,
		},
	})
}
