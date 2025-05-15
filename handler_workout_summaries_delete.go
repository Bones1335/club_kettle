package main

import (
	"net/http"

	"github.com/Bones1335/club_kettle/internal/auth"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerDeleteWorkoutSummaries(w http.ResponseWriter, r *http.Request) {
	summaryID := r.PathValue("workout_summary_id")
	parsedUUID, err := uuid.Parse(summaryID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "couldn't parse UUID", err)
		return
	}

	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "couldn't find jwt", err)
		return
	}

	_, err = auth.ValidateJWT(token, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "couldn't validate jwt", err)
		return
	}

	err = cfg.db.DeleteWorkoutSummary(r.Context(), parsedUUID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't delete workout summary", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
