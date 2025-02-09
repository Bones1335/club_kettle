-- name: CreateUser :one
INSERT INTO users (
    id,
    created_at,
    updated_at,
    last_name,
    first_name,
    username,
    email
)
Values (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1,
    $2,
    $3,
    $4
)
RETURNING *;