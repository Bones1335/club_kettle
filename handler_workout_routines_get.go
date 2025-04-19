package main

import "net/http"

func (cfg *apiConfig) handlerGetWorkoutRoutines(w http.ResponseWriter, r *http.Request) {
	dbWorkoutRoutines, err := cfg.db.GetWorkoutRoutines(r.Context())
	if err != nil {
		respondWithError(w, http.StatusNotFound, "couldn't get workout routines", err)
		return
	}

	respondWithJSON(w, http.StatusOK, dbWorkoutRoutines)
}
