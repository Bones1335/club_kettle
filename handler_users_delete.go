package main

import (
	"net/http"

	"github.com/Bones1335/club_kettle/internal/auth"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerDeleteUsers(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("user_id")
	parsedUUID, err := uuid.Parse(userID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "couldn't parse uuid", err)
		return
	}

	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "couldn't find jwt", err)
		return
	}

	tokenedUserID, err := auth.ValidateJWT(token, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "couldn't validate jwt", err)
		return
	}

	if parsedUUID != tokenedUserID {
		respondWithError(w, http.StatusUnauthorized, "userIDs don't match", err)
		return
	}

	err = cfg.db.DeleteUser(r.Context(), parsedUUID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't delete user", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
