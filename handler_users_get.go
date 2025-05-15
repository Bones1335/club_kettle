package main

import (
	"net/http"

	"github.com/Bones1335/club_kettle/internal/auth"
	"github.com/Bones1335/club_kettle/internal/database"
)

func (cfg *apiConfig) handlerGetUsers(w http.ResponseWriter, r *http.Request) {
	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "couldn't find jwt", err)
		return
	}

	userID, err := auth.ValidateJWT(token, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "couldn't validate jwt", err)
		return
	}

	dbUser, err := cfg.db.GetUser(r.Context(), userID)
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
