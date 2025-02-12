package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/workout_api/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerUpdateUsers(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		ID        uuid.UUID `json:"id"`
		LastName  string    `json:"last_name"`
		FirstName string    `json:"first_name"`
		Username  string    `json:"username"`
		Email     string    `json:"email"`
	}

	type response struct {
		database.User
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	user, err := cfg.db.UpdateUser(r.Context(), database.UpdateUserParams{
		ID:        params.ID,
		LastName:  params.LastName,
		FirstName: params.FirstName,
		Username:  params.Username,
		Email:     params.Email,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't update user", err)
		return
	}

	respondWithJSON(w, http.StatusOK, response{
		database.User{
			ID:        user.ID,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
			LastName:  user.LastName,
			FirstName: user.FirstName,
			Username:  user.Username,
			Email:     user.Email,
		},
	})

}
