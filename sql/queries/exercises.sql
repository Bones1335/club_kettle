-- name: CreateExercise :one
INSERT INTO exercises (
    id,
    name,
    tool
)
VALUES (
    gen_random_uuid(),
    $1,
    $2
)
RETURNING *;

-- name: GetExercises :many
SELECT * FROM exercises;

-- name: GetSingleExercise :one
SELECT * FROM exercises
WHERE id = $1;

-- name: UpdateExercise :one
UPDATE exercises SET name = $2, tool = $3 
WHERE id = $1
RETURNING *;

-- name: DeleteExercise :exec
DELETE FROM exercises
WHERE id = $1;