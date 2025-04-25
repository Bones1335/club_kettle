-- +goose Up
ALTER TABLE rounds 
ADD COLUMN 
user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE workout_summaries 
ADD COLUMN 
user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE;

-- +goose Down
ALTER TABLE rounds 
DROP COLUMN 
user_id;

ALTER TABLE workout_summaries 
DROP COLUMN 
user_id;