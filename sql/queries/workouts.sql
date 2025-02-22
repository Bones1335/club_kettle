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

-- name: CreateWorkoutExercise :one
INSERT INTO workouts_exercises (
    id,
    time_seconds,
    weight_kg,
    workout_id,
    exercise_id
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4
)
RETURNING *;

-- name: CreateRound :one
INSERT INTO rounds (
    id,
    round_number,
    reps_completed,
    workout_exercise_id
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3
)
RETURNING *;