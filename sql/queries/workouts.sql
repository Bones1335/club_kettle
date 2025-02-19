-- name: CreateWorkout :one
INSERT INTO workouts (
    id,
    created_at,
    updated_at,
    name,
    description,
    total_duration,
    user_id
)
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1,
    $2,
    $3,
    $4
)
RETURNING *;