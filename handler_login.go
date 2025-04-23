package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/workout_api/internal/auth"
	"github.com/Bones1335/workout_api/internal/database"
)

func (cfg *apiConfig) handlerLogin(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Email    string `json:"login-email"`
		Password string `json:"login-password"`
	}

	type response struct {
		database.User
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Incorrect email or password", err)
		return
	}

	login, err := cfg.db.Login(r.Context(), params.Email)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "email not found", err)
		return
	}

	err = auth.CheckPasswordHash(params.Password, login.Password)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "incorrect password", err)
		return
	}

	respondWithJSON(w, http.StatusOK, response{
		User: database.User{
			ID:        login.ID,
			CreatedAt: login.CreatedAt,
			UpdatedAt: login.UpdatedAt,
			Email:     login.Email,
			LastName:  login.LastName,
			FirstName: login.FirstName,
			Username:  login.Username,
		},
	})
}
