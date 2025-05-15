package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/club_kettle/internal/auth"
	"github.com/Bones1335/club_kettle/internal/database"
)

func (cfg *apiConfig) handlerCreateWorkoutSummaries(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Rounds  []database.Round        `json:"rounds"`
		Summary database.WorkoutSummary `json:"workout_summary"`
	}

	type response struct {
		database.WorkoutSummary
	}

	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "couldn't get jwt", err)
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

	var roundReps []int32

	for _, round := range params.Rounds {
		workoutID, err := cfg.db.GetWorkoutIDFromRoutineAndExerciseID(r.Context(), database.GetWorkoutIDFromRoutineAndExerciseIDParams{
			WorkoutID:  params.Summary.WorkoutRoutineID,
			ExerciseID: round.WorkoutExerciseID,
		})
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "couldn't get workout exercise data", err)
			return
		}

		rnd, err := cfg.db.CreateRound(r.Context(), database.CreateRoundParams{
			Date:              round.Date,
			RoundNumber:       round.RoundNumber,
			RepsCompleted:     round.RepsCompleted,
			WorkoutExerciseID: workoutID.ID,
			UserID:            userID,
		})
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "couldn'tcreate round", err)
			return
		}

		roundReps = append(roundReps, int32(rnd.RepsCompleted))
	}
	totalReps := float32(repSum(roundReps))

	summary, err := cfg.db.CreateWorkoutSummaries(r.Context(), database.CreateWorkoutSummariesParams{
		WorkoutRoutineID: params.Summary.WorkoutRoutineID,
		Date:             params.Summary.Date,
		WeightInKg:       int32(params.Summary.WeightInKg),
		WorkoutNumber:    params.Summary.WorkoutNumber,
		TotalReps:        totalReps,
		WorkCapacity:     float32(totalReps * float32(params.Summary.WeightInKg)),
		UserID:           userID,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't create workout summary", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, response{
		database.WorkoutSummary{
			ID:               summary.ID,
			WorkoutRoutineID: summary.WorkoutRoutineID,
			Date:             summary.Date,
			WeightInKg:       summary.WeightInKg,
			WorkoutNumber:    summary.WeightInKg,
			TotalReps:        summary.TotalReps,
			WorkCapacity:     summary.WorkCapacity,
			UserID:           summary.UserID,
		},
	})
}

func repSum(roundReps []int32) int32 {
	sum := int32(0)
	for _, reps := range roundReps {
		sum += reps
	}

	return sum
}
