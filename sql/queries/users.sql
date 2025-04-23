-- name: CreateUser :one
INSERT INTO users (
    id,
    created_at,
    updated_at,
    last_name,
    first_name,
    username,
    email,
    password
)
Values (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1,
    $2,
    $3,
    $4,
    $5
)
RETURNING *;

-- name: Login :one
SELECT * FROM users
WHERE email = $1;

-- name: GetUser :one
SELECT * FROM users
WHERE id = $1;

-- name: UpdateUser :one
UPDATE users SET last_name = $2, first_name = $3, username = $4, email = $5, updated_at = NOW(), password = $6
WHERE id = $1
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;