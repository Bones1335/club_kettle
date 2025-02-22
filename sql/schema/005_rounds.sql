-- +goose Up
CREATE TABLE rounds (
    id UUID PRIMARY KEY,
    round_number INT NOT NULL,
    reps_completed REAL NOT NULL,
    workout_exercise_id UUID NOT NULL REFERENCES workouts_exercises (id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE rounds;