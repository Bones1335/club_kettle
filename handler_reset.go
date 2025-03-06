package main

import "net/http"

func (cfg *apiConfig) handlerReset(w http.ResponseWriter, r *http.Request) {
	if cfg.platform != "dev" {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Forbidden"))
	}

	cfg.db.ResetUsers(r.Context())
	cfg.db.ResetExercises(r.Context())
	cfg.db.ResetWorkoutRoutines(r.Context())
	cfg.db.ResetWorkoutExercises(r.Context())
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("database reset to initial state\n"))
}
