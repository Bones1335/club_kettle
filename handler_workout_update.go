package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/workout_api/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerUpdateWorkout(w http.ResponseWriter, r *http.Request) {
	workoutID := r.PathValue("workout_id")
	parsedUUID, err := uuid.Parse(workoutID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "couldn't get UUID", err)
		return
	}

	type parameters struct {
		Routine   database.WorkoutRoutine    `json:"workout_routine"`
		Exercises []database.WorkoutExercise `json:"exercises"`
	}

	type response struct {
		database.WorkoutRoutine
		Exercises []database.WorkoutExercise
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't decode parameters", err)
		return
	}

	routine, err := cfg.db.UpdateWorkoutRoutines(r.Context(), database.UpdateWorkoutRoutinesParams{
		ID:                parsedUUID,
		Name:              params.Routine.Name,
		Description:       params.Routine.Description,
		TotalDuration:     params.Routine.TotalDuration,
		RoundsPerExercise: params.Routine.RoundsPerExercise,
		RoundDuration:     params.Routine.RoundDuration,
		RestDuration:      params.Routine.RestDuration,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't update workout routine", err)
		return
	}

	var exercises []database.WorkoutExercise
	for _, exercise := range params.Exercises {
		exer, err := cfg.db.UpdateWorkoutExercises(r.Context(), database.UpdateWorkoutExercisesParams{
			WorkoutID: parsedUUID,
			Position:  exercise.Position,
		})
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "couldn't update workout exercises", err)
			return
		}

		exercises = append(exercises, exer)
	}

	respondWithJSON(w, http.StatusOK, response{
		routine,
		exercises,
	})
}
