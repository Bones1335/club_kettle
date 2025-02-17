package main

import (
	"net/http"

	"github.com/Bones1335/workout_api/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerGetUsers(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("user_id")
	parsedUUID, err := uuid.Parse(userID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Couldn't get UUID", err)
		return
	}

	dbUser, err := cfg.db.GetUser(r.Context(), parsedUUID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "invalid UUID", err)
		return
	}

	respondWithJSON(w, http.StatusOK, database.User{
		ID:        dbUser.ID,
		CreatedAt: dbUser.CreatedAt,
		UpdatedAt: dbUser.UpdatedAt,
		LastName:  dbUser.LastName,
		FirstName: dbUser.FirstName,
		Username:  dbUser.Username,
		Email:     dbUser.Email,
	})
}
