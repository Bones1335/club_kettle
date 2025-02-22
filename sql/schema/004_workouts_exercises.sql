-- +goose Up
CREATE TABLE workouts_exercises (
    id UUID PRIMARY KEY,
    time_seconds INTEGER NOT NULL,
    weight_kg INTEGER NOT NULL,
    workout_id UUID NOT NULL REFERENCES workouts (id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises (id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE workouts_exercises;