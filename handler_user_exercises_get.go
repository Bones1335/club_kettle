package main

import (
	"net/http"

	"github.com/Bones1335/club_kettle/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerGetUserExercises(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("user_id")
	parsedUUID, err := uuid.Parse(userID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Couldn't get UUID", err)
		return
	}

	dbUserExercises, err := cfg.db.GetUserExercises(r.Context(), parsedUUID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Couldn't get exercises by user_id", err)
		return
	}

	exercises := []database.Exercise{}
	for _, dbUserExercise := range dbUserExercises {
		exercises = append(exercises, database.Exercise{
			ID:     dbUserExercise.ID,
			Name:   dbUserExercise.Name,
			Tool:   dbUserExercise.Tool,
			UserID: dbUserExercise.UserID,
		})
	}

	respondWithJSON(w, http.StatusOK, exercises)
}
