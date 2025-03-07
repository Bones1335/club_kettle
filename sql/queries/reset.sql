-- name: ResetUsers :exec
DELETE FROM users;

-- name: ResetExercises :exec
DELETE FROM exercises;

-- name: ResetWorkoutRoutines :exec
DELETE FROM workout_routines;

-- name: ResetWorkoutExercises :exec
DELETE FROM workout_exercises;