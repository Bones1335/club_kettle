-- +goose Up
ALTER TABLE workout_summaries
DROP COLUMN workout_exercise_id;
ALTER TABLE workout_summaries
ADD COLUMN workout_routine_id UUID NOT NULL REFERENCES workout_routines (id) ON DELETE CASCADE;

-- +goose Down
ALTER TABLE workout_summaries
DROP COLUMN workout_routine_id UUID NOT NULL REFERENCES workout_routines (id) ON DELETE CASCADE;
ALTER TABLE workout_summaries
ADD COLUMN workout_exercise_id UUID NOT NULL REFERENCES workout_exercises (id) ON DELETE CASCADE;