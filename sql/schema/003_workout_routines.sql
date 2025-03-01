-- +goose Up
CREATE TABLE workout_routines (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    total_duration INTEGER NOT NULL, -- in minutes
    rounds_per_exercise INTEGER NOT NULL,
    round_duration INTEGER NOT NULL, -- in seconds
    rest_duration INTEGER NOT NULL   -- in seconds
);

-- +goose Down
DROP TABLE workout_routines;