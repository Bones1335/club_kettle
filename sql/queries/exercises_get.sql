-- name: GetUserExercises :many
SELECT * FROM exercises
WHERE user_id = $1;