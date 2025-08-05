# Club Kettle

Club Kettle is a workout API designed with Clubbells, Kettlebells, and Macebells in mind while staying simple to use.

## Description

Having two seperate apps to log and conduct my workouts has always been rather annoying and other tracking solutions either cost too much or don't have support for my workout tools. So, I built this API to act as my Excel workout logger that also stores how long a workout should take, how many intervals, and how long intervals and rest periods should. That way, I can hook it up to a basic front-end to log an entire workout based on my use case. 

Endurance strength training isn't a new concept, nor are the tools I've been using. But, having those tools not appear in mainstream applications gets very annoying when all you want to do is have a central location to store your data that isn't some slow spreadsheet or damageable notebook that inevitably gets lost. Not to mention the need for an easy to use timer built-in to the logger.

## Get Started

1. Clone the Repo
2. Install Goose for database migrations
3. Install SQLC tool to create database related GO code
4. Setup PostgreSQL
5. Setup environment variables
   - DATABASE_URL
   - PLATFORM
   - JWT_SECRET
6. Run goose migrations `./migrate.sh`
7. Start server
8. Run `./test.sh` to test endpoints
9. Get Swol

## How to Use

### User endpoints
   - "POST /api/login"
   - "POST /api/users"
   - "GET /api/users"
   - "PUT /api/users/{user_id}"
   - "DELETE /api/users/{user_id}"

### Exercise endpoints
   - "POST /api/exercises"
   - "GET /api/exercises"
   - "GET /api/exercises/{exercise_id}"
   - "PUT /api/exercises/{exercise_id}"
   - "DELETE /api/exercises/{exercise_id}"

### Workout Endpoints
   - "POST /api/workouts"
   - "GET /api/workouts"
   - "GET /api/workouts/{workout_id}"
   - "PUT /api/workouts/{workout_id}"
   - "DELETE /api/workouts/{workout_id}"

### Workout Summary Endpoints
   - "POST /api/workout_summaries"
	- "GET /api/workout_summaries"
	- "GET /api/workout_summaries/{workout_summary_id}"
	- "DELETE /api/workout_summaries/{workout_summary_id}"

## Contributing

### Clone the repo

```bash
git clone https://github.com/Bones1335/club_kettle
cd club_kettle
```

### Build the project

```bash
go build
```

### Migrate the Postgres database

```bash
./migrate.sh
```

### Run the project

```bash
./club_kettle
```

### Run the tests

```bash
./tests.sh
```

### Submit a pull request

If you'd like to contribute, please fork the repository and open a pull request to the `test` branch.

#### References

 - Prototype design for the database in regard to implementing exercises into workouts.
    - https://softwareengineering.stackexchange.com/questions/226189/designing-a-fitness-weight-lifiting-routine-database
