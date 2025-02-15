package main

import (
	"net/http"

	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerDeleteExercises(w http.ResponseWriter, r *http.Request) {
	exerciseIDString := r.PathValue("exercise_id")
	exerciseID, err := uuid.Parse(exerciseIDString)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid exercise ID", err)
		return
	}

	err = cfg.db.DeleteExercise(r.Context(), exerciseID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't delete exercise", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
