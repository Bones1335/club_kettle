# Workout API

This API allows the user to interact with a Postgresql database to track and store their workouts.

# Get Started

1. Clone the Repo
2. Install Goose for database migrations
3. Install SQLC tool to database related GO code
4. Setup PostgreSQL
5. Setup environment variables
6. Run `./migrate.sh`
7. Start server
8. Run `./test.sh` to test endpoints
9. Get Swol

# How to Use

## User endpoints
   - "POST /api/users"
   - "GET /api/users/{user_id}"
   - "PUT /api/users/{user_id}"
   - "DELETE /api/users/{user_id}"

## Exercise endpoints
   - "POST /api/exercises"
   - "GET /api/exercises"
   - "GET /api/users/{user_id}/exercises"
   - "GET /api/exercises/{exercise_id}"
   - "PUT /api/exercises/{exercise_id}"
   - "DELETE /api/exercises/{exercise_id}"

## Workout Endpoints
   - "POST /api/workouts"
   - "GET /api/workouts"
   - "GET /api/workouts/{workout_id}"
   - "PUT /api/workouts/{workout_id}"
   - "DELETE /api/workouts/{workout_id}"

## Workout Summary Endpoints
   - TBD

# TODO
 - [x] CREATE basic server with readiness check endpoint
 - [x] CREATE basic user (more user info to be added later)
 - [x] For testing/development, CREATE a reset endpoint to reset the database to zero
 - [x] GET user info
 - [x] UPDATE user info
 - [ ] DELETE user info
 - [x] CREATE exercise endpoint where the user can create various exercises
 - [x] Endpoint to GET all created exercises by a user
 - [x] UPDATE an exercise
 - [x] DELETE an exercise
 - [x] CREATE workout with registered exercises
 - [x] GET full workout
 - [ ] UPDATE workout 
 - [ ] DELETE workout

 # References

 - Prototype design for the database in regard to implementing exercises into workouts.
    - https://softwareengineering.stackexchange.com/questions/226189/designing-a-fitness-weight-lifiting-routine-database