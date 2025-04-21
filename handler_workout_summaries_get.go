package main

import "net/http"

func (cfg *apiConfig) handlerGetWorkoutSummaries(w http.ResponseWriter, r *http.Request) {
	dbWorkoutSummaries, err := cfg.db.GetWorkoutSummaries(r.Context())
	if err != nil {
		respondWithError(w, http.StatusNotFound, "couldn't get workout summaries", err)
		return
	}

	respondWithJSON(w, http.StatusOK, dbWorkoutSummaries)
}
