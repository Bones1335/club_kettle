package main

import (
	"net/http"
	"sort"

	"github.com/Bones1335/club_kettle/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerGetWorkout(w http.ResponseWriter, r *http.Request) {
	type response struct {
		Workout   database.WorkoutRoutine
		Exercises []database.Exercise
	}
	workoutID := r.PathValue("workout_id")
	parsedUUID, err := uuid.Parse(workoutID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "couldn't get workout ID", err)
		return
	}

	dbWorkoutExercises, err := cfg.db.GetWorkoutRoutineExercises(r.Context(), parsedUUID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't get exercises based on workout ID", err)
		return
	}

	sort.Slice(dbWorkoutExercises, func(i, j int) bool {
		return dbWorkoutExercises[i].Position < dbWorkoutExercises[j].Position
	})

	var exerciseIDs []uuid.UUID

	for _, exerciseID := range dbWorkoutExercises {
		exerciseIDs = append(exerciseIDs, exerciseID.ExerciseID)
	}

	dbWorkoutRoutine, err := cfg.db.GetSingleWorkoutRoutine(r.Context(), parsedUUID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "couldn't get workout routines", err)
		return
	}

	var exercises []database.Exercise

	for _, id := range exerciseIDs {
		exercise, err := cfg.db.GetSingleExercise(r.Context(), id)
		if err != nil {
			respondWithError(w, http.StatusNotFound, "couldn't get exercise for workout routine", err)
			return
		}

		exercises = append(exercises, exercise)
	}

	respondWithJSON(w, http.StatusOK, response{Workout: dbWorkoutRoutine, Exercises: exercises})
}
