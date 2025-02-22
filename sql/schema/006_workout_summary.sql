-- +goose Up
CREATE TABLE workout_summary (
    workout_exercise_id UUID REFERENCES workouts_exercises (id) ON DELETE CASCADE,
    total_reps REAL NOT NULL,
    work_capacity REAL NOT NULL
);

-- +goose Down
DROP TABLE workout_summary;