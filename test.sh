#!/bin/bash

curl -X POST http://localhost:8080/admin/reset

JSON_POST1=$(curl -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d '{"email":"abcd@efgh.com","last_name":"Smith","first_name":"John","username":"snow83","password":"0123456"}')

echo $JSON_POST1 | jq .

user_id=$(echo $JSON_POST1 | jq -r .id)
user_last=$(echo $JSON_POST1 | jq -r .last_name)
user_first=$(echo $JSON_POST1 | jq -r .first_name)
user_user=$(echo $JSON_POST1 | jq -r .username)

LOGIN_1=$(curl -X POST http://localhost:8080/api/login -H "Content-Type:application/json" -d '{"login-email":"abcd@efgh.com","login-password":"0123456"}')

token=$(echo $LOGIN_1 | jq -r .token)

url1="http://localhost:8080/api/users/$user_id"

JSON_PUT1=$(curl -X PUT $url1 -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "{\"id\":\"$user_id\",\"email\":\"john.snow83@gmail.com\",\"last_name\":\"$user_last\",\"first_name\":\"$user_first\",\"username\":\"$user_user\",\"password\":\"0123456\"}")

echo $JSON_PUT1 | jq .

JSON_POST2=$(curl -X POST http://localhost:8080/api/exercises -H "Content-Type:appication/json" -H "Authorization: Bearer $token" -d "{\"name\":\"inside circle\",\"tool\":\"clubbell\"}")

echo $JSON_POST2 | jq .

JSON_POST3=$(curl -X POST http://localhost:8080/api/exercises -H "Content-Type:appication/json" -H "Authorization: Bearer $token" -d "{\"name\":\"outside circle\",\"tool\":\"clubbell\"}")

echo $JSON_POST3 | jq .

JSON_POST4=$(curl -X POST http://localhost:8080/api/exercises -H "Content-Type:appication/json" -H "Authorization: Bearer $token" -d "{\"name\":\"inside pendulum circle\",\"tool\":\"clubbell\"}")

echo $JSON_POST4 | jq .

exercise_id=$(echo $JSON_POST3 | jq -r .id)

curl -X DELETE "http://localhost:8080/api/exercises/$exercise_id" 

curl -X GET "http://localhost:8080/api/users/$user_id" -H "Authorization: Bearer $token" | jq .

exercise_id=$(echo $JSON_POST4 | jq -r .id)

url2="http://localhost:8080/api/exercises/$exercise_id"

JSON_PUT2=$(curl -X PUT $url2 -H "Content-Type: application/json" -d "{\"name\":\"inside pendulum\",\"tool\":\"clubbell\"}")

echo $JSON_PUT2 | jq .

ex1=$(curl -X POST http://localhost:8080/api/exercises -H "Content-Type:appication/json" -H "Authorization: Bearer $token" -d "{\"name\":\"inside circle\",\"tool\":\"clubbell\"}" | jq -r .id)


ex2=$(curl -X POST http://localhost:8080/api/exercises -H "Content-Type:appication/json" -H "Authorization: Bearer $token" -d "{\"name\":\"outside pendulum\",\"tool\":\"clubbell\"}" | jq -r .id)


ex3=$(curl -X POST http://localhost:8080/api/exercises -H "Content-Type:appication/json" -H "Authorization: Bearer $token" -d "{\"name\":\"pullover\",\"tool\":\"clubbell\"}" | jq -r .id)


ex4=$(curl -X POST http://localhost:8080/api/exercises -H "Content-Type:appication/json" -H "Authorization: Bearer $token" -d "{\"name\":\"balance squat\",\"tool\":\"clubbell\"}" | jq -r .id)


ex5=$(curl -X POST http://localhost:8080/api/exercises -H "Content-Type:appication/json" -H "Authorization: Bearer $token" -d "{\"name\":\"shield cast\",\"tool\":\"clubbell\"}" | jq -r .id)


JSON_POST5=$(curl -X POST http://localhost:8080/api/workouts -H "Content-Type:application/json" -d "{\"name\":\"2h Mill Squat - Level 1\",\"description\":\"Level 1 two-hand Mill-Squat program for heavy clubs.\",\"total_duration\":20,\"rounds_per_exercise\":4,\"round_duration\":30,\"rest_duration\":30,\"exercises\": [\"$ex1\",\"$ex2\",\"$ex3\",\"$ex4\",\"$ex5\"]}")

echo $JSON_POST5 | jq .