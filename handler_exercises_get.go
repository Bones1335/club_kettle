package main

import (
	"net/http"

	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerGetExercises(w http.ResponseWriter, r *http.Request) {
	dbExercises, err := cfg.db.GetExercises(r.Context())
	if err != nil {
		respondWithError(w, http.StatusNotFound, "couldn't get exercises from db", err)
		return
	}

	respondWithJSON(w, http.StatusOK, dbExercises)
}

func (cfg *apiConfig) handlerGetSingleExercise(w http.ResponseWriter, r *http.Request) {
	exerciseID := r.PathValue("exercise_id")
	parsedUUID, err := uuid.Parse(exerciseID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "couldn't get exercise ID", err)
		return
	}

	dbExercise, err := cfg.db.GetSingleExercise(r.Context(), parsedUUID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "couldn't find exercise", err)
		return
	}

	respondWithJSON(w, http.StatusOK, dbExercise)
}
