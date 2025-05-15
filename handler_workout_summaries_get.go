package main

import (
	"net/http"

	"github.com/Bones1335/club_kettle/internal/auth"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerGetWorkoutSummaries(w http.ResponseWriter, r *http.Request) {
	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "couldn'tfin jwt", err)
		return
	}

	userID, err := auth.ValidateJWT(token, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "couldn't validate jwt", err)
		return
	}

	dbWorkoutSummaries, err := cfg.db.GetWorkoutSummaries(r.Context(), userID)
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
