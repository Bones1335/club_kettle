#!/bin/bash

curl -X POST http://localhost:8080/admin/reset

curl -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d '{"email":"abcd@efgh.com"}' | jq .