package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/workout_api/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerCreateWorkoutRoutines(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name              string      `json:"name"`
		Description       string      `json:"description"`
		TotalDuration     int32       `json:"total_duration"`
		RoundsPerExercise int32       `json:"rounds_per_exercise"`
		RoundDuration     int32       `json:"round_duration"`
		RestDuration      int32       `json:"rest_duration"`
		Exercises         []uuid.UUID `json:"exercises"`
	}

	type response struct {
		Workout database.WorkoutRoutine
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't decode parameters", err)
		return
	}

	workout, err := cfg.db.CreateWorkoutRoutine(r.Context(), database.CreateWorkoutRoutineParams{
		Name:              params.Name,
		Description:       params.Description,
		TotalDuration:     int32(params.TotalDuration),
		RoundsPerExercise: int32(params.RoundsPerExercise),
		RoundDuration:     int32(params.RoundDuration),
		RestDuration:      int32(params.RestDuration),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't create workout", err)
		return
	}

	for i, exerciseID := range params.Exercises {
		_, err := cfg.db.AddExerciseToWorkout(r.Context(), database.AddExerciseToWorkoutParams{
			WorkoutID:  workout.ID,
			ExerciseID: exerciseID,
			Position:   int32(i + 1),
		})
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "couldn't create Workouts Exercise data", err)
			return
		}

	}

	respondWithJSON(w, http.StatusCreated, response{Workout: workout})
}
