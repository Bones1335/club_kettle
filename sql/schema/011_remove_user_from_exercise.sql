-- +goose Up
ALTER TABLE exercises
DROP COLUMN user_id;

-- +goose Down
ALTER TABLE exercises
ADD COLUMN user_id UUID REFERENCES users (id) ON DELETE CASCADE;
