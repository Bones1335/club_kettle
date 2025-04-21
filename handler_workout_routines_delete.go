package main

import (
	"net/http"

	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerDeleteWorkout(w http.ResponseWriter, r *http.Request) {
	workoutID := r.PathValue("workout_id")
	parsedUUID, err := uuid.Parse(workoutID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "couldn't parse UUID", err)
		return
	}

	err = cfg.db.DeleteWorkoutRoutines(r.Context(), parsedUUID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't delete workout routine", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
