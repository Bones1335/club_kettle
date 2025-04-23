package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/workout_api/internal/auth"
	"github.com/Bones1335/workout_api/internal/database"
)

func (cfg *apiConfig) handlerCreateUsers(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Email     string `json:"email"`
		LastName  string `json:"last_name"`
		FirstName string `json:"first_name"`
		UserName  string `json:"username"`
		Password  string `json:"password"`
	}

	type response struct {
		database.User
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't decode parameters", err)
		return
	}

	hashedPassword, err := auth.HashPassword(params.Password)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't hash password", err)
		return
	}

	user, err := cfg.db.CreateUser(r.Context(), database.CreateUserParams{
		Email:     params.Email,
		LastName:  params.LastName,
		FirstName: params.FirstName,
		Username:  params.UserName,
		Password:  hashedPassword,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't create user", err)
	}

	respondWithJSON(w, http.StatusCreated, response{
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
