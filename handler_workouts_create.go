package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/workout_api/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerCreateWorkouts(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		// Workout
		Name          string    `json:"name"`
		Description   string    `json:"description"`
		TotalDuration int32     `json:"total_duration"`
		UserID        uuid.UUID `json:"user_id"`
		//Exercise
		Exercises []database.Exercise `json:"exercise"`
		//Rounds
		Rounds []database.Round `json:"round"`
		//WorkoutsExercise
		TimeSeconds int32   `json:"time_seconds"`
		WeightKg    float32 `json:"weight_kg"`
		//WorkoutSummary
		TotalReps    float32 `json:"total_reps"`
		WorkCapacity float32 `json:"work_capacity"`
	}

	type response struct {
		database.Workout
		database.WorkoutSummary
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
		database.WorkoutSummary{},
	})
}
