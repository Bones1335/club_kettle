package main

import (
	"encoding/json"
	"net/http"

	"github.com/Bones1335/workout_api/internal/database"
)

func (cfg *apiConfig) handlerCreateWorkoutSummaries(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Rounds  []database.Round        `json:"rounds"`
		Summary database.WorkoutSummary `json:"workout_summary"`
	}

	type response struct {
		database.WorkoutSummary
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't decode parameters", err)
		return
	}

	var roundReps []int32

	for _, round := range params.Rounds {
		rnd, err := cfg.db.CreateRound(r.Context(), database.CreateRoundParams{
			Date:              round.Date,
			RoundNumber:       round.RoundNumber,
			RepsCompleted:     round.RepsCompleted,
			WorkoutExerciseID: round.WorkoutExerciseID,
		})
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "couldn'tcreate round", err)
			return
		}

		roundReps = append(roundReps, int32(rnd.RepsCompleted))
	}
	totalReps := float32(repSum(roundReps))

	summary, err := cfg.db.CreateWorkoutSummary(r.Context(), database.CreateWorkoutSummaryParams{
		WorkoutExerciseID: params.Summary.WorkoutExerciseID,
		Date:              params.Summary.Date,
		WeightInKg:        params.Summary.WeightInKg,
		WorkoutNumber:     params.Summary.WorkoutNumber,
		TotalReps:         totalReps,
		WorkCapacity:      totalReps * float32(params.Summary.WeightInKg),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "couldn't create workout summary", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, response{
		database.WorkoutSummary{
			WorkoutExerciseID: summary.WorkoutExerciseID,
			Date:              summary.Date,
			WeightInKg:        summary.WeightInKg,
			WorkoutNumber:     summary.WeightInKg,
			TotalReps:         summary.TotalReps,
			WorkCapacity:      summary.WorkCapacity,
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
