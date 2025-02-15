-- name: CreateExercise :one
INSERT INTO exercises (
    id,
    created_at,
    updated_at,
    name,
    tool,
    user_id
)
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1,
    $2,
    $3
)
RETURNING *;

-- name: GetUserExercises :many
SELECT * FROM exercises
WHERE user_id = $1;

-- name: DeleteExercise :exec
DELETE FROM exercises
WHERE id = $1;