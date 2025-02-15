#!/bin/bash

curl -X POST http://localhost:8080/admin/reset

JSON_POST1=$(curl -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d '{"email":"abcd@efgh.com","last_name":"Smith","first_name":"John","username":"snow83"}')

echo $JSON_POST1 | jq .

user_id=$(echo $JSON_POST1 | jq -r .id)
user_last=$(echo $JSON_POST1 | jq -r .last_name)
user_first=$(echo $JSON_POST1 | jq -r .first_name)
user_user=$(echo $JSON_POST1 | jq -r .username)

url="http://localhost:8080/api/users/$user_id"

echo $url
JSON_PUT1=$(curl -X PUT $url -H "Content-Type: application/json" -d "{\"id\":\"$user_id\",\"email\":\"john.snow83@gmail.com\",\"last_name\":\"$user_last\",\"first_name\":\"$user_first\",\"username\":\"$user_user\"}")

echo $JSON_PUT1 | jq .

JSON_POST2=$(curl -X POST http://localhost:8080/api/exercises -H "Content-Type:appication/json" -d "{\"name\":\"inside circle\",\"tool\":\"clubbell\",\"user_id\":\"$user_id\"}")

echo $JSON_POST2 | jq .