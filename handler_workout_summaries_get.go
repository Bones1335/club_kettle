package main

import (
	"net/http"

	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerGetWorkoutSummaries(w http.ResponseWriter, r *http.Request) {
	dbWorkoutSummaries, err := cfg.db.GetWorkoutSummaries(r.Context())
	if err != nil {
		respondWithError(w, http.StatusNotFound, "couldn't get workout summaries", err)
		return
	}

	respondWithJSON(w, http.StatusOK, dbWorkoutSummaries)
}

func (cfg *apiConfig) handlerGetSingleWorkoutSummary(w http.ResponseWriter, r *http.Request) {
	summaryID := r.PathValue("workout_summary_id")
	parsedUUID, err := uuid.Parse(summaryID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "couldn't parse uuid", err)
		return
	}

	dbSummary, err := cfg.db.GetSingleWorkoutSummary(r.Context(), parsedUUID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't get summary data", err)
		return
	}

	respondWithJSON(w, http.StatusOK, dbSummary)
}
