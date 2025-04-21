-- +goose Up
CREATE TABLE workout_summaries (
    id UUID PRIMARY KEY NOT NULL,
    workout_exercise_id UUID NOT NULL REFERENCES workout_exercises (id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL,
    weight_in_kg INTEGER NOT NULL,
    workout_number INTEGER NOT NULL,
    total_reps REAL NOT NULL,
    work_capacity REAL NOT NULL
);

-- +goose Down
DROP TABLE workout_summaries;