#!/bin/bash

cd sql/schema

goose postgres postgres://postgres:postgres@localhost:5432/workout_api?sslmode=disable down

goose postgres postgres://postgres:postgres@localhost:5432/workout_api?sslmode=disable up

cd ../..