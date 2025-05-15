package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/club_kettle/internal/auth"
	"github.com/Bones1335/club_kettle/internal/database"
	"github.com/google/uuid"
)

func (cfg *apiConfig) handlerCreateExercises(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name   string    `json:"name"`
		Tool   string    `json:"tool"`
		UserID uuid.UUID `json:"user_id"`
	}

	type response struct {
		database.Exercise
	}

	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "couldn't find jwt", err)
		return
	}

	userID, err := auth.ValidateJWT(token, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "couldn't validate jwt", err)
		return
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't decode parameters", err)
		return
	}

	if userID != params.UserID {
		respondWithError(w, http.StatusUnauthorized, "userIDs don't match", err)
		return
	}

	exercise, err := cfg.db.CreateExercise(r.Context(), database.CreateExerciseParams{
		Name:   params.Name,
		Tool:   params.Tool,
		UserID: userID,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't create exercise", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, response{
		database.Exercise{
			ID:     exercise.ID,
			Name:   exercise.Name,
			Tool:   exercise.Tool,
			UserID: exercise.UserID,
		},
	})
}
