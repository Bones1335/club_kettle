package main

import (
	"net/http"

	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerDeleteWorkoutSummaries(w http.ResponseWriter, r *http.Request) {
	summaryID := r.PathValue("workout_summary_id")
	parsedUUID, err := uuid.Parse(summaryID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "couldn't parse UUID", err)
		return
	}

	err = cfg.db.DeleteWorkoutSummary(r.Context(), parsedUUID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't delete workout summary", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
