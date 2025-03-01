package main

import (
	"net/http"
)

func (cfg *apiConfig) handlerGetExercises(w http.ResponseWriter, r *http.Request) {
	dbExercises, err := cfg.db.GetExercises(r.Context())
	if err != nil {
		respondWithError(w, http.StatusNotFound, "couldn't get exercises from db", err)
		return
	}

	respondWithJSON(w, http.StatusOK, dbExercises)
}
