-- +goose Up
CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY,
    workout_id UUID NOT NULL REFERENCES workout_routines (id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
    position INTEGER NOT NULL, -- keeps track of Exercise 1, 2, 3, etc...
    UNIQUE (workout_id, position)
);

-- +goose Down
DROP TABLE workout_exercises;